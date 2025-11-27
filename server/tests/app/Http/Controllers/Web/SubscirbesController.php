<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SubscirbesController extends Controller
{
    protected string $email;
    protected string $subject;
    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function sendMail(Request $request){

        try {
            $data['email'] = $request->input('email');
            if($data['email'] != '' ){
                $contact = Settings::query()->first();
                $this->email = $contact->email?:'bolnisi1@mes.gov.ge';
                $this->subject = 'ახალი გამომწერი';

                Mail::send('web.pages.contact.subscribes_mail', ['data' => $data], function ($message) {
                    $message->from( $this->email, 'sso.edu.ge');
                    $message->subject($this->subject);
                    $message->to($this->email);
                });

                return response(['message' => 'Subscribed'], 200)->header('Content-Type', 'application/json');
            }else{
                return response(['message' => 'email is empty'], 204)->header('Content-Type', 'application/json');
            }
        }catch (\Exception $exception){
            return response(['message' => $exception], 500)->header('Content-Type', 'application/json');
        }


    }
}
