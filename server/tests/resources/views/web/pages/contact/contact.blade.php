@extends('layouts.app')
@section('content')
<div class="all-title-box"  style="background-image: url('{{Helper::getThumbImage(!is_null($page->info)?$page->info->covers:[],config('files.covers.page_cover.id'))}}');">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h2>{{Helper::checkInfo($page,'title')}}</h2>
                <ul class="breadcrumb">
                    {{Components::currentLocation(Helper::checkInfo($page,'title'))}}
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="container">
    <div class="mt-3">
        <iframe width="100%" height="400"  id="gmap_canvas"  src="https://maps.google.com/maps?q={{Helper::checkInfo($contact,'address')}}&hl=es;z=14&amp;output=embed"
                frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
    </div>
    <div class="row mt-3">
        <div class="col-xl-6">
            <div class="contact-form-side">
                <div class="center">
                    <div class="contact-form-title">
                        <h3>{{Language::translate('haveQuestion')}}</h3>
                    </div>
                    <div id="wrap" class="mb-3">

                        <div class="form-group">
                            <input id="username"  class="form-control"  placeholder="{{Language::translate('fullName')}}" type="text" required />
                            <span class="underline"></span>
                        </div>
                        <div class="form-group">

                            <input id="contact-email" class="form-control"  placeholder="{{Language::translate('email')}}" type="text" required />

                            <span class="underline"></span>
                        </div>
                        <div class="form-group">
                            <input id="object" class="form-control"  placeholder="{{Language::translate('subject')}}"  type="text" required />
                            <span class="underline"></span>
                        </div>
                        <div class="form-group">
                            <textarea id="contact-text" class="form-control"  placeholder="{{Language::translate('yourMessage')}}" type="text" rows="5" required></textarea>
                            <span class="underline"></span>
                        </div>
                        <div class="error" style="display: none;color:red; font-weight: bold;text-align: center">
                            {{Language::translate('error_inputs_is_empty')}}
                        </div>
                        <div class="text-success" style="display: none;color:green; font-weight: bold;text-align: center">
                            {{Language::translate('mail_success')}}
                        </div>
                        <button class="btn btn-primary" type="button" id="send_contact">{{Language::translate('send')}}</button>

                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-6">
            <div class="col-lg-4 col-md-12 col-sm-12">
                <div class="footer-link-contact text-dark" >
                    <ul>
                        <li >
                            <p style="color:#232323 !important;"><i class="fas fa-map-marker-alt"></i>{{Language::translate('address')}}: <a style="color:#232323 !important;" href="https://maps.google.com/maps?q={{$contact->info->address}}" target="_blank">{{\app('Contact')->info->address}}</a></p>
                        </li>
                        <li >
                            <p style="color:#232323 !important;"><i class="fas fa-phone-square"></i>{{Language::translate('phone')}}: <a style="color:#232323 !important;" href="tel:{{\app('Contact')->phone}}">{{\app('Contact')->phone}}</a></p>
                        </li>
                        <li >
                            <p style="color:#232323 !important;"><i class="fas fa-envelope"></i>{{Language::translate('email')}}: <a style="color:#232323 !important;" href="mailto:{{\app('Contact')->email}}">{{\app('Contact')->email}}</a></p>
                        </li>
                    </ul>
                </div>
            </div>


        </div>


    </div>
</div>
{{--<section class="contact-section">--}}
{{--    <div class="container">--}}
{{--        <div class="row">--}}
{{--            <div class="section-center">--}}
{{--                <div class="contact-form-title">--}}
{{--                    <h2>{{Helper::checkInfo($page,'title')}}</h2>--}}
{{--                </div>--}}
{{--                <div class="contact-form-content">--}}
{{--                    <div class="contact-map-side">--}}
{{--                        <div class="col-12">--}}
{{--                            <iframe width="100%" height="400"  id="gmap_canvas"  src="https://maps.google.com/maps?q={{Helper::checkInfo($contact,'address')}}&hl=es;z=14&amp;output=embed"--}}
{{--                                     frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>--}}
{{--                        </div>--}}
{{--                        <div class="contact-page-content ">--}}
{{--                            <ul class="contact-list">--}}
{{--                                <li class="grid-item grid-item-2">--}}
{{--                                    <a href="tel: {{$contact->phone}}">--}}
{{--                                        <div class="phone-image">--}}
{{--                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"--}}
{{--                                                 xmlns="http://www.w3.org/2000/svg">--}}
{{--                                                <path--}}
{{--                                                    d="M15.75 12.315V14.967C15.7501 15.1569 15.6781 15.3397 15.5487 15.4786C15.4192 15.6176 15.2419 15.7022 15.0525 15.7155C14.7247 15.738 14.457 15.75 14.25 15.75C7.62225 15.75 2.25 10.3778 2.25 3.75C2.25 3.543 2.26125 3.27525 2.2845 2.9475C2.29779 2.75808 2.38244 2.58076 2.52135 2.45131C2.66027 2.32186 2.84312 2.24991 3.033 2.25H5.685C5.77803 2.24991 5.86777 2.28439 5.9368 2.34677C6.00582 2.40914 6.0492 2.49494 6.0585 2.5875C6.07575 2.76 6.0915 2.89725 6.1065 3.0015C6.25555 4.04169 6.561 5.05337 7.0125 6.00225C7.08375 6.15225 7.03725 6.3315 6.90225 6.4275L5.28375 7.584C6.27334 9.88984 8.11091 11.7274 10.4167 12.717L11.5717 11.1015C11.619 11.0355 11.6878 10.9882 11.7664 10.9677C11.8449 10.9473 11.9281 10.9551 12.0015 10.9897C12.9503 11.4404 13.9617 11.7451 15.0015 11.8935C15.1058 11.9085 15.243 11.925 15.414 11.9415C15.5064 11.951 15.592 11.9944 15.6543 12.0634C15.7165 12.1324 15.7509 12.2221 15.7507 12.315H15.75Z"--}}
{{--                                                    fill="#789383" />--}}
{{--                                            </svg>--}}
{{--                                        </div>--}}
{{--                                        <div class="phone">--}}
{{--                                            <span>{{Language::translate('phone')}}</span>--}}
{{--                                            <p>{{$contact->phone}}</p>--}}
{{--                                        </div>--}}
{{--                                    </a>--}}
{{--                                </li>--}}
{{--                                <li class="grid-item grid-item-4">--}}
{{--                                    <a href="mailto:{{$contact->email}}" target="_blank">--}}
{{--                                        <div class="mail-image">--}}
{{--                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"--}}
{{--                                                 xmlns="http://www.w3.org/2000/svg">--}}
{{--                                                <path--}}
{{--                                                    d="M2.25 2.25H15.75C15.9489 2.25 16.1397 2.32902 16.2803 2.46967C16.421 2.61032 16.5 2.80109 16.5 3V15C16.5 15.1989 16.421 15.3897 16.2803 15.5303C16.1397 15.671 15.9489 15.75 15.75 15.75H2.25C2.05109 15.75 1.86032 15.671 1.71967 15.5303C1.57902 15.3897 1.5 15.1989 1.5 15V3C1.5 2.80109 1.57902 2.61032 1.71967 2.46967C1.86032 2.32902 2.05109 2.25 2.25 2.25ZM9.045 8.76225L4.236 4.6785L3.26475 5.8215L9.05475 10.7378L14.7405 5.81775L13.7595 4.683L9.04575 8.76225H9.045Z"--}}
{{--                                                    fill="#789383" />--}}
{{--                                            </svg>--}}
{{--                                        </div>--}}
{{--                                        <div class="email">--}}
{{--                                            <span>{{Language::translate('email')}}</span>--}}
{{--                                            <p>{{$contact->email}}</p>--}}
{{--                                        </div>--}}
{{--                                    </a>--}}
{{--                                </li>--}}
{{--                                <li class="grid-item grid-item-1">--}}
{{--                                    <a href="https://maps.google.com/maps?q={{$contact->info->address}}" target="_blank">--}}
{{--                                        <div class="map-image">--}}
{{--                                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none"--}}
{{--                                                 xmlns="http://www.w3.org/2000/svg">--}}
{{--                                                <path--}}
{{--                                                    d="M14.5382 13.7465L9.5 18.7846L4.46184 13.7465C3.4654 12.75 2.78681 11.4805 2.5119 10.0984C2.23699 8.71625 2.37809 7.28365 2.91737 5.98173C3.45665 4.67982 4.36988 3.56705 5.54157 2.78415C6.71327 2.00125 8.09081 1.58337 9.5 1.58337C10.9092 1.58337 12.2867 2.00125 13.4584 2.78415C14.6301 3.56705 15.5434 4.67982 16.0826 5.98173C16.6219 7.28365 16.763 8.71625 16.4881 10.0984C16.2132 11.4805 15.5346 12.75 14.5382 13.7465ZM9.5 11.875C10.3399 11.875 11.1453 11.5413 11.7392 10.9475C12.333 10.3536 12.6667 9.54816 12.6667 8.70831C12.6667 7.86846 12.333 7.06301 11.7392 6.46914C11.1453 5.87528 10.3399 5.54165 9.5 5.54165C8.66015 5.54165 7.8547 5.87528 7.26083 6.46914C6.66697 7.06301 6.33334 7.86846 6.33334 8.70831C6.33334 9.54816 6.66697 10.3536 7.26083 10.9475C7.8547 11.5413 8.66015 11.875 9.5 11.875ZM9.5 10.2916C9.08008 10.2916 8.67735 10.1248 8.38042 9.8279C8.08348 9.53096 7.91667 9.12824 7.91667 8.70831C7.91667 8.28839 8.08348 7.88566 8.38042 7.58873C8.67735 7.29179 9.08008 7.12498 9.5 7.12498C9.91993 7.12498 10.3227 7.29179 10.6196 7.58873C10.9165 7.88566 11.0833 8.28839 11.0833 8.70831C11.0833 9.12824 10.9165 9.53096 10.6196 9.8279C10.3227 10.1248 9.91993 10.2916 9.5 10.2916Z"--}}
{{--                                                    fill="#789383" />--}}
{{--                                            </svg>--}}
{{--                                        </div>--}}
{{--                                        <div class="address">--}}
{{--                                            <span>{{Language::translate('address')}}</span>--}}
{{--                                            <p>{{$contact->info->address}}</p>--}}
{{--                                        </div>--}}
{{--                                    </a>--}}
{{--                                </li>--}}
{{--                            </ul>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                    <div class="contact-form-side">--}}
{{--                        <div class="center">--}}
{{--                            <div class="contact-form-title">--}}
{{--                                <h3>{{Language::translate('haveQuestion')}}</h3>--}}
{{--                            </div>--}}
{{--                            <div id="wrap" class="input">--}}
{{--                                <section class="input-content">--}}
{{--                                    <div class="input-content-wrap">--}}
{{--                                        <dl class="inputbox">--}}
{{--                                            <dd class="inputbox-content">--}}
{{--                                                <input id="username" type="text" required />--}}
{{--                                                <label for="username">{{Language::translate('fullName')}}</label>--}}
{{--                                                <span class="underline"></span>--}}
{{--                                            </dd>--}}
{{--                                        </dl>--}}
{{--                                        <dl class="inputbox">--}}
{{--                                            <dd class="inputbox-content">--}}
{{--                                                <input id="contact-email" type="text" required />--}}
{{--                                                <label for="contact-email">{{Language::translate('email')}}</label>--}}
{{--                                                <span class="underline"></span>--}}
{{--                                            </dd>--}}
{{--                                        </dl>--}}
{{--                                        <dl class="inputbox">--}}
{{--                                            <dd class="inputbox-content">--}}
{{--                                                <input id="object" type="text" required />--}}
{{--                                                <label for="object">{{Language::translate('subject')}}</label>--}}
{{--                                                <span class="underline"></span>--}}
{{--                                            </dd>--}}
{{--                                        </dl>--}}
{{--                                        <dl class="inputbox">--}}
{{--                                            <dd class="inputbox-content textarea">--}}
{{--                                                <textarea id="contact-text" type="text" rows="5" required></textarea>--}}
{{--                                                <label for="contact-text">{{Language::translate('yourMessage')}}</label>--}}
{{--                                                <span class="underline"></span>--}}
{{--                                            </dd>--}}
{{--                                        </dl>--}}
{{--                                        <div class="error" style="display: none;color:red; font-weight: bold;text-align: center">--}}
{{--                                            {{Language::translate('error_inputs_is_empty')}}--}}
{{--                                        </div>--}}
{{--                                        <div class="text-success" style="display: none;color:green; font-weight: bold;text-align: center">--}}
{{--                                            {{Language::translate('mail_success')}}--}}
{{--                                        </div>--}}
{{--                                        <button class="form__btn" type="button" id="send_contact">--}}
{{--                                                <span class="form__btn--visible">--}}
{{--                                                    <p>{{Language::translate('send')}}</p>--}}
{{--                                                </span>--}}
{{--                                        </button>--}}

{{--                                    </div>--}}
{{--                                </section>--}}
{{--                            </div>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </div>--}}
{{--</section>--}}
@stop
