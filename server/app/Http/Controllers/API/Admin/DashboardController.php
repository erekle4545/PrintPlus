<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\Category;
use App\Models\Core\Files;
use App\Models\Core\Page;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = User::query()->count();

        $page = Page::query()->count();

        $category = Category::query()->count();

        $files = Files::query()->count();

        return [
            'users'=> $user,
            'pages'=>$page,
            'categories'=>$category,
            'files'=>$files
        ];
        //$user = $request->user();
//        // Total Number of Surveys
//        $total = Survey::query()->where('user_id', $user->id)->count();
//
//        // Latest Survey
//        $latest = Survey::query()->where('user_id', $user->id)->latest('created_at')->first();
//
//        // Total Number of answers
//        $totalAnswers = SurveyAnswer::query()
//            ->join('surveys', 'survey_answers.survey_id', '=', 'surveys.id')
//            ->where('surveys.user_id', $user->id)
//            ->count();
//
//        // Latest 5 answer
//        $latestAnswers = SurveyAnswer::query()
//            ->join('surveys', 'survey_answers.survey_id', '=', 'surveys.id')
//            ->where('surveys.user_id', $user->id)
//            ->orderBy('end_date', 'DESC')
//            ->limit(5)
//            ->getModels('survey_answers.*');
//
//        return [
//            'totalSurveys' => $total,
//            'latestSurvey' => $latest ? new SurveyResourceDashboard($latest) : null,
//            'totalAnswers' => $totalAnswers,
//            'latestAnswers' => SurveyAnswerResource::collection($latestAnswers)
//        ];
    }
}
