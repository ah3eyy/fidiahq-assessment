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
class AdminService {
    createTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, color, total_team_count } = req.body;
                let newTeam = new teams_1.default();
                newTeam.name = name;
                newTeam.color = color;
                newTeam.total_team_count = total_team_count || 0;
                yield newTeam.save();
                return response_handler_1.default.successResponse('Team created successfully', { team: newTeam }, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred creating account at the moment', null, res, 500);
            }
        });
    }
    deleteTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let team_id = req.params.team_id;
                // soft delete would come in handy
                yield teams_1.default.deleteOne({ _id: team_id });
                // delete fixtures
                yield fixtures_1.default.deleteMany({ team: team_id });
                return response_handler_1.default.successResponse('Team deleted successfully', null, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred deleting team at the moment', null, res, 500);
            }
        });
    }
    editTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, color, total_team_count, team_id } = req.body;
                let team = yield teams_1.default.findOne({ _id: team_id });
                if (!team)
                    return response_handler_1.default.errorResponse('Invalid team id provided', null, res);
                if (name)
                    team.name = name;
                if (color)
                    team.color = color;
                if (total_team_count)
                    team.total_team_count = total_team_count;
                yield team.save();
                return response_handler_1.default.successResponse('Team updated successfully', { team }, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred editing team at the moment', null, res, 500);
            }
        });
    }
    teams(req, res) {
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
    createFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { home_team_id, away_team_id, match_time } = req.body;
                // check if each team are a valid team
                let homeTeamCheck = yield teams_1.default.findOne({ _id: home_team_id });
                if (!homeTeamCheck)
                    return response_handler_1.default.errorResponse('Home team not a valid team', null, res);
                let awayTeamCheck = yield teams_1.default.findOne({ _id: away_team_id });
                if (!awayTeamCheck)
                    return response_handler_1.default.errorResponse('Away team not a valid team', null, res);
                let newFixtures = new fixtures_1.default();
                newFixtures.home_team = home_team_id;
                newFixtures.away_team = away_team_id;
                newFixtures.match_time = match_time;
                yield newFixtures.save();
                return response_handler_1.default.successResponse('Fixtures created successfully', { fixture: newFixtures }, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred creating fixtures', null, res);
            }
        });
    }
    deleteFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fixture_id = req.body.fixture_id;
                // delete fixtures
                yield fixtures_1.default.deleteOne({ _id: fixture_id });
                return response_handler_1.default.successResponse('Fixture deleted successfully', null, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred deleting fixture at the moment', null, res, 500);
            }
        });
    }
    editFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { fixture_id, match_time } = req.body;
                let fixture = yield fixtures_1.default.findOne({ _id: fixture_id });
                if (!fixture)
                    return response_handler_1.default.errorResponse('No fixture for the id provided', null, res);
                // only match time can be updated
                if (match_time)
                    fixture.match_time = match_time;
                yield fixture.save();
                return response_handler_1.default.successResponse('Fixtures updated successfully', { fixture }, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred updating fixtures', null, res);
            }
        });
    }
    fixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page_number = req.query.page_number || 1;
                let skip = (page_number - 1) * 30;
                let { start_date, end_date } = req.query;
                let query = {};
                if (start_date)
                    query['match_time'] = { $gte: start_date, $lte: end_date };
                let fixtures = yield fixtures_1.default.aggregate([
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
    fixtureDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fixture_id = req.params.fixture_id;
                let fixtures = yield fixtures_1.default.findOne({ _id: fixture_id }).populate('away_team').populate('home_team');
                if (!fixtures)
                    return response_handler_1.default.errorResponse('Invalid fixture id provided', null, res);
                let data = { fixtures };
                return response_handler_1.default.successResponse('Team details', data, res);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred fetching fixture record at the moment', null, res, 500);
            }
        });
    }
}
exports.default = new AdminService();
//# sourceMappingURL=admin-service.js.map