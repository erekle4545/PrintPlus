<?php

namespace App\Http\Controllers\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Models\Core\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{

    protected  string $email;
    protected  string $subject;
    public function sendMail(Request $request){
        $data['username'] = $request->input('username');
        $data['object'] = $request->input('object');
        $data['email'] = $request->input('email');
        $data['text'] = $request->input('text');
        if($data['username'] != '' || $data['object'] != '' || $data['email'] != '' || $data['text'] != '' ){
            $contact = Settings::whereHas('info', function ($query) {

            })->first();

            $this->email = $contact->email?:'bolnisi1@mes.gov.ge';
            $this->subject = 'შეტყობინება';

            Mail::send('web.pages.contact.mail', ['data' => $data, 'info' => $contact], function ($message) {
                $message->from( $this->email, 'sso.edu.ge');
                $message->subject($this->subject);
                $message->to($this->email);
            });

            return response(['message' => 'message sent'], 200)->header('Content-Type', 'application/json');
        }else{
            return response(['message' => 'message not sent'], 500)->header('Content-Type', 'application/json');

        }

    }


}
