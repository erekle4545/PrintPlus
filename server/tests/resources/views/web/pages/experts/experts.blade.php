@extends('layouts.app')
@section('content')
    <div class="main-banner experts-main">
    <div class="container">
       @include('web.components.header.logoAuthBar')

        <div class="experts">
            <div class="section-title">
                <h1>experts</h1>
                <div class="experts-select">
                    <select class="form-select" aria-label="Default select example">
                        <option selected>field of science</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
            </div>
            <div class="row experts-wrapper" data-aos="fade-up">
                <div class="col expertsLeft">
                    <div class="expert-image">
                        <img src="{{asset('assets/images/expert1.png')}}" alt="" />
                    </div>
                </div>
                <div class="col expertsRight">
                    <div class="expert-info">
                        <div class="expert-name">
                            <h3>lasha matiashvili</h3>
                        </div>
                        <a href="#" class="more-info">Additional information + </a>
                    </div>
                    <div class="expert-desc">
                        <div class="field">
                            <h4 class="field-name">field</h4>
                            <p class="field-desc">
                                Linguistics Computer Sciences Interdisciplinary Sciences
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">workplace</h4>
                            <p class="field-desc">
                                LM Audit Company of Georgia Ltd
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">email</h4>
                            <p class="field-desc">
                                lashamatiashvili@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row experts-wrapper" data-aos="fade-up">
                <div class="col expertsLeft">
                    <div class="expert-image">
                        <img src="{{asset('assets/images/expert2.png')}}" alt="" />
                    </div>
                </div>
                <div class="col expertsRight">
                    <div class="expert-info">
                        <div class="expert-name">
                            <h3>mariam goderdzishvili</h3>
                        </div>
                        <a href="#" class="more-info">Additional information + </a>
                    </div>
                    <div class="expert-desc">
                        <div class="field">
                            <h4 class="field-name">field</h4>
                            <p class="field-desc">
                                Medicine Microbiology Sociology Geomorphology Entomology
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">workplace</h4>
                            <p class="field-desc">
                                Georgian audit company M&G Ltd
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">email</h4>
                            <p class="field-desc">
                                lashamatiashvili@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row experts-wrapper" data-aos="fade-up">
                <div class="col expertsLeft">
                    <div class="expert-image">
                        <img src="{{asset('assets/images/expert3.png')}}" alt="" />
                    </div>
                </div>
                <div class="col expertsRight">
                    <div class="expert-info">
                        <div class="expert-name">
                            <h3>nikoloz metreveli</h3>
                        </div>
                        <a href="#" class="more-info">Additional information + </a>
                    </div>
                    <div class="expert-desc">
                        <div class="field">
                            <h4 class="field-name">field</h4>
                            <p class="field-desc">
                                Medicine Microbiology Sociology Geomorphology Entomology
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">workplace</h4>
                            <p class="field-desc">
                                Georgian audit company M&G Ltd
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">email</h4>
                            <p class="field-desc">
                                lashamatiashvili@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row experts-wrapper" data-aos="fade-up">
                <div class="col expertsLeft">
                    <div class="expert-image">
                        <img src="{{asset('assets/images/expert1.png')}}'" alt="" />
                    </div>
                </div>
                <div class="col expertsRight">
                    <div class="expert-info">
                        <div class="expert-name">
                            <h3>lasha matiashvili</h3>
                        </div>
                        <a href="#" class="more-info">Additional information + </a>
                    </div>
                    <div class="expert-desc">
                        <div class="field">
                            <h4 class="field-name">field</h4>
                            <p class="field-desc">
                                Linguistics Computer Sciences Interdisciplinary Sciences
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">workplace</h4>
                            <p class="field-desc">
                                LM Audit Company of Georgia Ltd
                            </p>
                        </div>
                        <div class="field">
                            <h4 class="field-name">email</h4>
                            <p class="field-desc">
                                lashamatiashvili@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
