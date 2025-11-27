<?php

namespace App\Http\Controllers\API\Admin;
USE DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\FilesResource;
use http\Env\Response;
use Illuminate\Support\Facades\File;
use App\Models\Core\Files;
use App\Http\Requests\StoreFilesRequest;
use App\Http\Requests\UpdateFilesRequest;
use App\Models\Core\Folder;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use mysql_xdevapi\Exception;

class FilesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

       $files =  Files::where('user_id',$request->user()->id)->orderBy('created_at','DESC');
        if($request->extensions){
            $extensions = implode(",", $request->extensions);
            if($extensions ==='image'){
                $files->whereIn('extension',['jpg','png']);
            }elseif($extensions ==='video'){
                $files->whereIn('extension',['mp4','WEBM']);
            }elseif($extensions ==='docs'){
                $files->whereIn('extension',['pdf','docx','xlsx','xls','cvs']);
            }elseif($extensions ==='video,image' or $extensions ==='image,video'){
                $files->whereIn('extension',['jpg','png','mp4','WEBM']);
            }elseif($extensions ==='docs,image' or $extensions ==='image,docs'){
                $files->whereIn('extension',['jpg','png','pdf','docx','xlsx','xls','cvs']);
            }elseif($extensions ==='docs,video' or $extensions ==='video,docs'){
                $files->whereIn('extension',['mp4','WEBM','pdf','docx','xlsx','xls','cvs']);
            }elseif($extensions ==='video,image,docs' or $extensions ==='video,docs,image'or $extensions ==='docs,video,image'){
                $files->whereIn('extension',['jpg','png','mp4','WEBM','pdf','docx','xlsx','xls','cvs']);
            }
        }

        return FilesResource::collection($files->paginate(24));

    }


    public function getCovers(Request $request)
    {
        $ids = explode(",", $request->id);
         return FilesResource::collection(Files::whereIn('id',$ids)->orderBy('created_at','DESC')->get());

    }

    public function getByFolder(Request $request,Folder $folder){
        if($folder->user_id != $request->user()->id){
            return abort(403,'Unauthorized');
        }

        $where = [
            'folder_id' => $folder->id
        ];
        return FilesResource::collection(Files::where($where)->paginate());

    }



    public function resize(StoreFilesRequest $request)
    {
        $all = $request->all();

//        $request->validate([
//            'images' => 'required',
//        ]);
//        $all = $request->all();
//        foreach($all['images'] as $image) {
//            $image->move(public_path('files'),$image->getClientOriginalName());
//            $data =[
//                'name' => 'asd',
//                'path' => '/storage/',
//                'folder_id'=>1,
//                'type'=>Files::TYPE_RESIZE,
//                'data'=>json_encode($all),
//                'user_id'=>$request->user()->id
//            ];
//            Files::create($data);
//        }
//        return response($all['images']);


//            $file = $all['file'];
//            unset($all['file']);
            $data = [
                'type' => Files::TYPE_RESIZE,
                'data' => json_encode($all),
                'user_id' => $request->user()->id
            ];
            if (isset($all['folder_id'])) {
                // TODO
                $folder = Folder::find($all['folder_id']);
                if ($folder->user_id != $request->user()->id) {
                    return abort(403, 'Unauthorized');
                }
                $data['folder_id'] = $all['folder_id'];
            }

            // Move image in public Where path   Str::Random()
            $wFolder = str_replace('%', '', $all['w']);
            $hFolder = str_replace('%', '', isset($all['h']));
            $whName = isset($all['h']) ? $wFolder . "x" . $hFolder : $wFolder . "xhAuto";
        foreach($all['file'] as $file) {
            if ($file instanceof UploadedFile) {
                $extensionFolder = $file->getClientOriginalExtension();
                if ($extensionFolder === 'jpg' || $extensionFolder === 'png' || $extensionFolder === 'jpeg') {
                    $generateFolderName = 'images';
                } elseif ($extensionFolder === 'mp4') {
                    $generateFolderName = 'videos';
                } elseif ($extensionFolder === 'pdf') {
                    $generateFolderName = 'docs';
                } else {
                    $generateFolderName = 'files';
                }
                $dir = 'uploads/' . $generateFolderName . '/' . $folder->name . '/' . $whName . '/';
            } else {
                $generateFolderName = 'files';
                $dir = 'uploads/' . $generateFolderName . '/' . $folder->name . '/' . $whName . '/';

            }
            $absolutePath = $dir;
            if (!File::exists($absolutePath)) {
                File::makeDirectory($absolutePath, 0755, true);
            }
            // END Move image in public Where path

            if ($file instanceof UploadedFile) {
                $data['name'] = $file->getClientOriginalName();
                $filename = pathinfo($data['name'], PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $data['extension'] = $extension;
                $originalPath = $absolutePath . $data['name'];
                $file->move($absolutePath, $data['name']);
                $data['path'] = $dir . $data['name']; //
            } else {
                $data['name'] = pathinfo($file, PATHINFO_BASENAME);
                $filename = pathinfo($file, PATHINFO_FILENAME);
                $extension = pathinfo($file, PATHINFO_EXTENSION);
                $data['extension'] = $extension;
                $originalPath = $absolutePath . $data['name'];
                copy($file, $originalPath);
            }

            $data['path'] = $dir . $data['name'];
            $w = $all['w'];
            $h = $all['h'] ?? false;

            // Resize
            if ($extension === 'jpg' || $extension === 'png' || $extension === 'jpeg') {
                list($width, $height, $image) = $this->getWidthAndHeight($w, $h, $originalPath);
                $resizedFilename = $filename . '-x-' . $width . '-resized.' . $extension;
                $image->resize($width, $height)->save($absolutePath . $resizedFilename);
            } else {
                $resizedFilename = $filename . '.' . $extension;
            }
            $data['output_path'] = $dir . $resizedFilename;
            $fileManipulation = Files::create($data);


            //  return new FilesResource($fileManipulation);
        }

        return response('Success',200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreFilesRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFilesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Core\Files  $files
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request,Files $files)
    {
        if($files->user_id != $request->user()->id){
            return abort(403,'Unauthorized');
        }

        return new FilesResource($files);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Core\Files  $files
     * @return \Illuminate\Http\Response
     */
    public function edit(Files $files)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateFilesRequest  $request
     * @param  \App\Models\Core\Files  $files
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateFilesRequest $request, Files $files)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Core\Files  $files
     * @return \Illuminate\Http\Response
     */
    public function destroy(Files $files,$image)
    {
//        if($files->user_id != $request->user()->id){
//            return abort(403,'Unauthorized');
//        }

        $data =  DB::table('files')->whereIn('id', [$image])->get();
        foreach ($data as $row){
            $path =  $row->path;
            $output_path =  $row->output_path;
            File::delete($path);
            File::delete($output_path);
        }
        try {

            $ids = explode(",", $image);
            $files->destroy($ids);
        }catch (Exception $e) {
        return response(['result' => 'not found'], 404)->header('Content-Type', 'application/json');
        }
        return response($image,204);
    }



    protected function getWidthAndHeight($w, $h, string $originalPath)
    {
        $image =  Image::make($originalPath);
        $originalWidth = $image->width();
        $originalHeight = $image->height();

        if(str_ends_with($w,'%')){
            $ratioW = str_replace('%','',$w);
            $ratioH = $h ? str_replace('%','',$h):$ratioW;

            $newWidth = $originalWidth * $ratioW / 100;
            $newHeight = $originalHeight * $ratioH / 100;

        }else{
            $newWidth = (float)$w;
            $newHeight = $h?(float)$h:($originalHeight * $newWidth/$originalWidth);
        }

        return [$newWidth,$newHeight,$image];
    }
}
