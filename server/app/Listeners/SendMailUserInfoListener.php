<?php

namespace App\Listeners;

use App\Events\SendMailUserInfoEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendMailUserInfoListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SendMailUserInfoEvent  $event): void
    {
        $this->email = $event->email ?: 'ereklegiorgadze777@gmail.com';
        $this->subject = 'მინი სოფტ პაროლი';

        Mail::send('mail', ['user' => $event,'password'=>$event->password], function ($message) {
            $message->from('noreply@beflex.ge');
            $message->subject($this->subject);
            $message->to($this->email);
        });

    }
}
