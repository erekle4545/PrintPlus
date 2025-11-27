@extends('layouts.app')
@section('content')
    {{Components::currentLocation(Helper::checkInfo($page,'title'))}}
    <section id="tabs" class="project-tab">
        <div class="container">
            <div class="gallery-title">
                <h2>{{Helper::checkInfo($page,'title')}}</h2>
            </div>
            <nav class="tab-nav text-center mb-5">
                <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                    <a  class="nav-item image_gallery_btn nav-link active" style="text-align: right;" id="nav-home-tab" data-toggle="tab"
                       href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_36_262)">
                                <path
                                    d="M8.6091 6.30908C7.65141 6.30908 6.875 7.08545 6.875 8.04318C6.875 9.00088 7.65137 9.77728 8.6091 9.77728C9.5668 9.77728 10.3432 9.00092 10.3432 8.04318C10.3432 7.08545 9.56684 6.30908 8.6091 6.30908ZM8.6091 8.95149C8.10743 8.95149 7.70076 8.54481 7.70076 8.04314C7.70076 7.54148 8.10743 7.1348 8.6091 7.1348C9.11077 7.1348 9.51744 7.54148 9.51744 8.04314C9.51744 8.54481 9.11077 8.95149 8.6091 8.95149Z"
                                    fill="none" />
                                <path
                                    d="M15.5248 2.34536L4.25323 1.06547C3.81577 1.00328 3.37254 1.13098 3.03525 1.41643C2.698 1.67793 2.48182 2.06556 2.43658 2.4899L2.23016 4.18271H1.59016C0.681814 4.18271 0.000557891 4.9878 0.000557891 5.89614V14.3395C-0.0223206 15.2057 0.661307 15.9264 1.52753 15.9493C1.54839 15.9499 1.56929 15.95 1.59016 15.9497H12.9236C13.832 15.9497 14.6577 15.2478 14.6577 14.3395V14.0092C14.9394 13.9548 15.2065 13.8423 15.4422 13.6789C15.7767 13.3973 15.9909 12.9985 16.0409 12.5641L16.9905 4.18271C17.0873 3.27227 16.434 2.45327 15.5248 2.34536ZM13.832 14.3395C13.832 14.7937 13.3778 15.1239 12.9236 15.1239H1.59016C1.17989 15.136 0.837538 14.8132 0.825486 14.4029C0.824854 14.3818 0.825131 14.3606 0.826316 14.3395V12.8118L4.02614 10.4584C4.41053 10.1633 4.95195 10.1895 5.30607 10.5204L7.55626 12.5022C7.89797 12.7891 8.32812 12.9495 8.77427 12.9563C9.1231 12.9606 9.4662 12.8677 9.7652 12.688L13.832 10.3346V14.3395H13.832ZM13.832 9.3643L9.33161 11.9861C8.94517 12.215 8.45603 12.1736 8.1136 11.8829L5.84278 9.88039C5.19195 9.32116 4.2407 9.28686 3.5513 9.79781L0.826316 11.7796V5.89614C0.826316 5.44197 1.13599 5.00847 1.59016 5.00847H12.9236C13.4089 5.02858 13.8007 5.41155 13.832 5.89614V9.3643ZM16.1656 4.07124C16.1653 4.07397 16.165 4.07673 16.1647 4.07946L15.1945 12.4609C15.1961 12.6782 15.097 12.884 14.9261 13.0183C14.8435 13.1008 14.6577 13.1421 14.6577 13.1834V5.89614C14.6251 4.95568 13.8644 4.20401 12.9236 4.18271H3.05588L3.24167 2.57248C3.28198 2.36397 3.391 2.17502 3.55134 2.03573C3.73239 1.91055 3.9513 1.85219 4.17068 1.87056L15.4216 3.17112C15.8756 3.21423 16.2087 3.61723 16.1656 4.07124Z"
                                    fill="none" />
                            </g>
                            <defs>
                                <clipPath id="clip0_36_262">
                                    <rect width="17" height="17" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        {{Language::translate('photo')}}
                    </a>
                    <a class="video_gallery_btn nav-item nav-link" style="text-align: left;" id="nav-profile-tab" data-toggle="tab"
                       href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">
                        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.6038 8.8922L6.38501 6.25548C6.24121 6.16553 6.05627 6.15718 5.90381 6.23362C5.75146 6.31019 5.65625 6.45907 5.65625 6.62112V11.8946C5.65625 12.0566 5.75146 12.2055 5.90381 12.2821C6.05627 12.3585 6.24121 12.3501 6.38501 12.2602L10.6038 9.62348C10.7341 9.542 10.8125 9.40478 10.8125 9.25784C10.8125 9.1109 10.7341 8.97368 10.6038 8.8922ZM6.59375 11.0734V7.44223L9.49866 9.25784L6.59375 11.0734Z"
                                fill="none" />
                            <path
                                d="M15.5312 3.54492H15.0625V2.22656C15.0625 1.98383 14.8527 1.78711 14.5938 1.78711H14.125V0.439453C14.125 0.196724 13.9152 0 13.6562 0H2.34375C2.08484 0 1.875 0.196724 1.875 0.439453V1.78711H1.40625C1.14734 1.78711 0.9375 1.98383 0.9375 2.22656V3.54492H0.46875C0.209839 3.54492 0 3.74165 0 3.98438V14.5605C0 14.8033 0.209839 15 0.46875 15H15.5312C15.7902 15 16 14.8033 16 14.5605V3.98438C16 3.74165 15.7902 3.54492 15.5312 3.54492ZM2.8125 0.878906H13.1875V1.78711H2.8125V0.878906ZM1.875 2.66602H14.125V3.54492H1.875V2.66602ZM15.0625 14.1211H0.9375V4.42383H15.0625V14.1211Z"
                                fill="none" />
                        </svg>
                        {{Language::translate('video')}}
                    </a>
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div class="">
                        <div class="row photo-gallery" id="result_data_gallery_image">
                        @foreach($image as $row)
                            <div class="col-md-4">
                                <a href="{{URL::to(Language::current().'/'.$page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}">
                                    <div class="card h-100 photo-item">
                                        <div class="card-body">
                                            <p class="card-text">
                                                <div class="photo-gallery-img-title">
                                                    <p>{{$row->info->title}}</p>
                                                </div>
                                            </p>
                                        </div>

                                        <div class="card-img">
                                            @foreach($row->info->covers as $rows)
                                                @if($rows->cover_type === config('files.covers.gallery_thumb.id'))
                                                    <img src="{{asset($rows->output_path)}}" class="card-img-top"  alt="{{Helper::checkInfo($row,'title')}}"/>

                                                @endif
                                            @endforeach
                                        </div>
                                    </div>
                                </a>
                            </div>
                        @endforeach
                            <div class="pagination">
                                {{ $image->fragment('image')->links('pagination::bootstrap-4') }}
                            </div>
                        </div>

                    </div>
                </div>
                <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <div class="video-page-gallery" >
                        @foreach($video as $rowVideo)
                            <div class="video-item">
                                     <a href="{{$rowVideo->link}}" class="video-img popup-youtube">
                                         @foreach($rowVideo->info->covers as $rows)
                                             @if($rows->cover_type === config('files.covers.video.id'))
                                                 <img src="{{asset($rows->output_path)}}" alt="{{Helper::checkInfo($rowVideo,'title')}}"/>
                                             @endif
                                         @endforeach
                                           <svg width="73" height="73" viewBox="0 0 73 73" fill="none"
                                               xmlns="http://www.w3.org/2000/svg">
                                                 <path
                                                 d="M48.0871 34.7023L33.089 23.7984C32.5386 23.3993 31.8079 23.3392 31.2047 23.6493C30.5966 23.957 30.2168 24.582 30.2168 25.2575V47.0581C30.2168 47.7408 30.5966 48.3634 31.2047 48.6711C31.4618 48.8009 31.743 48.8658 32.0267 48.8658C32.3968 48.8658 32.7718 48.748 33.089 48.5148L48.0871 37.6205C48.5606 37.272 48.837 36.7335 48.837 36.1614C48.8394 35.5797 48.5558 35.0436 48.0871 34.7023Z"
                                                   fill="none" />
                                              <path
                                                    d="M36.1761 0C16.2267 0 0.0605469 16.1683 0.0605469 36.1204C0.0605469 56.0652 16.2267 72.2287 36.1761 72.2287C56.1207 72.2287 72.2893 56.0628 72.2893 36.1204C72.2917 16.1683 56.1207 0 36.1761 0ZM36.1761 66.2022C19.5629 66.2022 6.09343 52.7382 6.09343 36.1204C6.09343 19.5097 19.5629 6.02888 36.1761 6.02888C52.787 6.02888 66.254 19.5073 66.254 36.1204C66.2564 52.7382 52.787 66.2022 36.1761 66.2022Z"
                                                     fill="none" />
                                         </svg>
                                     </a>
                                      <div class="video-date">
                                          <div>
                                                <img src="{{asset('img/svg/date.svg')}}" alt="">
                                                 <span>{{$rowVideo->created_at}}</span>
                                          </div>
                                      </div>
                                <div class="video-desc">
                                     <p>{{$rowVideo->info->title}}</p>
                                </div>
                            </div>
                        @endforeach
                        <div class="pagination">
                            {{ $video->fragment('video')->links('pagination::bootstrap-4') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
