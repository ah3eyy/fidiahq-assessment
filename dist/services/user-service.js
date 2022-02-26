"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teams_1 = __importDefault(require("../database/models/teams"));
const response_handler_1 = __importDefault(require("../helpers/response-handler"));
const fixtures_1 = __importDefault(require("../database/models/fixtures"));
class UserService {
    allTeams(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page_number = req.query.page_number || 1;
                let skip = (page_number - 1) * 30;
                let pipeline = [
                    {
                        '$sort': { 'createdAt': -1 }
                    },
                    {
                        '$facet': {
                            metadata: [{ $count: "total" }, { $addFields: { page: page_number } }],
                            data: [{ $skip: skip }, { $limit: 30 }]
                        }
                    }
                ];
                let { name, start_date, end_date } = req.query;
                //  filter by name
                // performing regex search with aggregate would have been better but that function not allowed on mu current atlas tier
                if (name)
                    pipeline = [{
                            $match: {
                                $text: {
                                    $search: name
                                }
                            }
                        }, ...pipeline];
                if (start_date && end_date)
                    pipeline = [...pipeline, {
                            $match: {
                                createdAt: { $gte: start_date, $lte: end_date }
                            }
                        }];
                let teams = yield teams_1.default.aggregate(pipeline);
                return response_handler_1.default.successResponse('All teams', { teams: teams }, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred fetching team record at the moment', null, res, 500);
            }
        });
    }
    teamDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let team_id = req.params.team_id;
                let team = yield teams_1.default.findOne({ _id: team_id });
                if (!team)
                    return response_handler_1.default.errorResponse('Invalid team id provided', null, res);
                let fixtures = yield fixtures_1.default.find({
                    $or: [
                        { home_team: team_id },
                        { away_team: team_id }
                    ]
                });
                let data = { team, fixtures };
                return response_handler_1.default.successResponse('Team details', data, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred fetching current team', null, res);
            }
        });
    }
    completedFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page_number = req.query.page_number || 1;
                let skip = (page_number - 1) * 30;
                let fixtures = yield fixtures_1.default.aggregate([
                    {
                        $match: { 'status': 'completed' }
                    },
                    {
                        '$sort': { 'createdAt': -1 }
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'home_team',
                            foreignField: '_id',
                            as: 'home_team'
                        },
                    },
                    {
                        $unwind: "$home_team",
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'away_team',
                            foreignField: '_id',
                            as: 'away_team'
                        },
                    },
                    {
                        $unwind: "$away_team",
                    },
                    {
                        '$facet': {
                            metadata: [{ $count: "total" }, { $addFields: { page: page_number } }],
                            data: [{ $skip: skip }, { $limit: 30 }]
                        }
                    }
                ]);
                return response_handler_1.default.successResponse('All fixtures', { fixtures }, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred fetching team record at the moment', null, res, 500);
            }
        });
    }
    pendingFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page_number = req.query.page_number || 1;
                let skip = (page_number - 1) * 30;
                let fixtures = yield fixtures_1.default.aggregate([
                    {
                        $match: { 'status': 'pending' }
                    },
                    {
                        '$sort': { 'createdAt': -1 }
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'home_team',
                            foreignField: '_id',
                            as: 'home_team'
                        },
                    },
                    {
                        $unwind: "$home_team",
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'away_team',
                            foreignField: '_id',
                            as: 'away_team'
                        },
                    },
                    {
                        $unwind: "$away_team",
                    },
                    {
                        '$facet': {
                            metadata: [{ $count: "total" }, { $addFields: { page: page_number } }],
                            data: [{ $skip: skip }, { $limit: 30 }]
                        }
                    }
                ]);
                return response_handler_1.default.successResponse('All fixtures', { fixtures }, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred fetching team record at the moment', null, res, 500);
            }
        });
    }
    searchFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page_number = req.query.page_number || 1;
                let skip = (page_number - 1) * 30;
                let { start_date, end_date, search_term } = req.query;
                //    start date and end date : search based on fixtures that match date fall between specified dates
                // search_term : search fixture based on the team
                let pipeline = [
                    {
                        '$sort': { 'createdAt': -1 }
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'home_team',
                            foreignField: '_id',
                            as: 'home_team'
                        },
                    },
                    {
                        $unwind: {
                            path: "$home_team",
                            preserveNullAndEmptyArrays: true
                        },
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'away_team',
                            foreignField: '_id',
                            as: 'away_team'
                        },
                    },
                    {
                        $unwind: {
                            path: "$away_team",
                            preserveNullAndEmptyArrays: true
                        },
                    },
                    {
                        $addFields: {
                            'away_name': '$away_team.name',
                            'home_name': '$home_team.name'
                        }
                    },
                    {
                        '$facet': {
                            metadata: [{ $count: "total" }, { $addFields: { page: page_number } }],
                            data: [{ $skip: skip }, { $limit: 30 }]
                        }
                    }
                ];
                // check for match date
                if (start_date && end_date)
                    pipeline = [...pipeline, {
                            $match: {
                                match_date: { $gte: start_date, $lte: end_date }
                            }
                        }];
                // search by name
                if (search_term) {
                    // search by home
                    let search = {
                        $match: {
                            // $or : [
                            //     {'home_team.name': {$ne: search_term}},
                            //     {'away_team.name': {$ne: search_term}}
                            // ]
                            // $expr: {
                            //     $eq: [
                            //         'home_name',
                            //         search_term
                            //     ]
                            // }
                            // 'away_name' : search_term
                            'home_name': search_term
                        }
                    };
                    pipeline = [...pipeline, search];
                }
                let fixtures = yield fixtures_1.default.aggregate(pipeline);
                let data = {
                    fixtures
                };
                return response_handler_1.default.successResponse('Search Fixtures', data, res);
            }
            catch (e) {
                console.log(e);
                return response_handler_1.default.errorResponse('An error occurred fetching fixtures', null, res, 500);
            }
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user-service.js.map