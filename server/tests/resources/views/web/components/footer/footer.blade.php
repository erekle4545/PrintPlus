<footer>
    <div class="footer-main">
        <div class="container">

            <div class="row">
                <div class="col-lg-4 col-md-12 col-sm-12">
                    <div class="footer-top-box">
                        <h3>{{Language::translate('socialNetworks')}}</h3>
                        <p>{{Language::translate('socialNetworksText')}}.</p>
                        <ul>
                            @if(isset(\app('Contact')->meta['facebook']))
                                <li><a target="_blank" href="{{\app('Contact')->meta['facebook']}}"><i class="fab fa-facebook" aria-hidden="true"></i></a></li>
                            @endif
                            @if(isset(\app('Contact')->meta['instagram']))
                                <li><a target="_blank" href="{{\app('Contact')->meta['instagram']}}"><i class="fab fa-instagram" aria-hidden="true"></i></a></li>
                            @endif
                            @if(isset(\app('Contact')->meta['youtube']))
                                <li><a target="_blank" href="{{\app('Contact')->meta['youtube']}}"><i class="fab fa-youtube" aria-hidden="true"></i></a></li>
                            @endif
                        </ul>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12 col-sm-12">
                    <div class="footer-link">
                        <h4>{{Language::translate('footerPages')}}</h4>
                        <ul data-in="fadeInDown" data-out="fadeOutUp">
                            @widget('Menu', ['type' => config('menu.positions.header'), 'view' => 'menu'])
                        </ul>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12 col-sm-12">
                    <div class="footer-link-contact">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>
                                <p><i class="fas fa-map-marker-alt"></i>{{Language::translate('address')}}:{{isset(\app('Contact')->info->address)?\app('Contact')->info->address:null}}</p>
                            </li>
                            <li>
                                <p><i class="fas fa-phone-square"></i>{{Language::translate('phone')}}: <a href="tel:{{\app('Contact')->phone}}">{{\app('Contact')->phone}}</a></p>
                            </li>
                            <li>
                                <p><i class="fas fa-envelope"></i>{{Language::translate('email')}}: <a href="mailto:{{\app('Contact')->email}}">{{\app('Contact')->email}}</a></p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
{{--<div class="contact-area section-padding40 section-bg2 d-flex align-items-end fix" style="background-color: #f9f9f9" data-background="assets/img/gallery/video-bg.png">--}}
{{--    <div class="container">--}}
{{--        <div class="row">--}}
{{--            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 ">--}}

{{--                <div>--}}
{{--                    <div class="footer-logo mb-35">--}}
{{--                        <a href="" ><img height="100px" src="{{asset('assets/img/logo/logo.png')}}" alt="" /></a>--}}
{{--                    </div>--}}
{{--                    <p><strong>{{Language::translate('phone')}}:</strong> {{\app('Contact')->phone}}</p>--}}
{{--                    <p><strong>{{Language::translate('email')}}:</strong> {{\app('Contact')->email}}</p>--}}
{{--                    <p><strong>{{Language::translate('address')}}:</strong>{{\app('Contact')->info->address}}</p>--}}

{{--                </div>--}}
{{--            </div>--}}
{{--            <div class="col-xl-6 col-lg-6 col-md-8">--}}
{{--                <div class="form-wrapper"  data-animation="bounceIn" data-delay="0.2s" >--}}
{{--                    <div class="form-tittle mb-30 text-center">--}}
{{--                        <img src="{{asset('assets/img/icon/chat-box.svg')}}" alt class="mb-15" />--}}
{{--                        <h2> {{Language::translate('contactUs')}}</h2>--}}
{{--                        <p>--}}

{{--                        </p>--}}
{{--                    </div>--}}
{{--                    <form id="contact-form" action="#" method="POST">--}}
{{--                        <div class="row">--}}
{{--                            <div class="col-lg-12">--}}
{{--                                <div class="form-box user-icon mb-15">--}}
{{--                                    <input--}}
{{--                                        type="text"--}}
{{--                                        name="name"--}}
{{--                                        placeholder="Your Name"--}}
{{--                                    />--}}
{{--                                </div>--}}
{{--                            </div>--}}
{{--                            <div class="col-lg-12">--}}
{{--                                <div class="form-box email-icon mb-15">--}}
{{--                                    <input type="text" name="email" placeholder="{{Language::translate('email')}}" />--}}
{{--                                </div>--}}
{{--                            </div>--}}

{{--                            <div class="col-lg-12">--}}
{{--                                <div class="form-box message-icon mb-15">--}}
{{--                        <textarea--}}
{{--                            name="message"--}}
{{--                            id="message"--}}
{{--                            placeholder="Your message"--}}
{{--                        ></textarea>--}}
{{--                                </div>--}}
{{--                                <div class="submit-info">--}}
{{--                                    <button class="submit-btn2" type="submit">--}}
{{--                                       {{Language::translate('sendMessage')}}--}}
{{--                                    </button>--}}
{{--                                </div>--}}
{{--                            </div>--}}
{{--                        </div>--}}
{{--                    </form>--}}
{{--                </div>--}}
{{--            </div>--}}

{{--        </div>--}}
{{--    </div>--}}
{{--</div>--}}


