from flask import Blueprint, jsonify, request
import pandas as pd


receiving_blueprint = Blueprint('receiving', __name__)


@receiving_blueprint.route('/player/recsummary',  methods=['POST'])
def receiving():
    player_id = request.json.get('player_id')
    startSeason = int(request.json.get('startSeason'))
    startWeek = int(request.json.get('startWeek'))
    endSeason = int(request.json.get('endSeason'))
    endWeek = int(request.json.get('endWeek'))

    file = './all_pbp.csv.gz'

    df = pd.read_csv(file, compression='gzip', low_memory=False)

    df_range = df[

        (
            (df['season'] < 2021) & (df['week'] < 18) |
            (df['week'] < 19)
        ) &
        (
            (
                (df['season'].eq(startSeason)) &
                (df['week'].ge(startWeek))
            ) | (
                df['season'].gt(startSeason)
            )
        ) & (
            (
                (df['season'].eq(endSeason)) &
                (df['week'].le(endWeek))
            ) | (
                df['season'].lt(endSeason)
            )
        )
    ]

    for p in request.json.get('include'):
        if p != "0":
            df_range = df_range[df_range['offense_players'].str.contains(
                p['gsis_id'], na=False)]

    for p in request.json.get('exclude'):
        if p != "0":
            df_range = df_range[~df_range['offense_players'].str.contains(
                p['gsis_id'], na=False)]

    participation = df_range[
        (df_range['offense_players'].str.contains(f"{player_id}", na=False)) &
        (df_range['pass_attempt'] == 1)
    ]

    games = participation['game_id'].nunique()
    routes = len(participation)

    targeted = df_range[
        (df_range['receiver_player_id'] == player_id) &
        (df_range['pass_attempt'] == 1)
    ]
    targets = len(targeted)

    rec = targeted[targeted['complete_pass'] == 1]
    rec_yds = rec['receiving_yards'].sum()
    rec_td = rec['pass_touchdown'].sum()

    air_yards = df_range[df_range['receiver_player_id']
                         == player_id]['air_yards'].sum()

    def getKey():
        if request.json.get('breakoutby') == 'aDot':
            return 'air_yards_range'
        elif request.json.get('breakoutby') == 'formation':
            return 'offense_personnel'
        else:
            return request.json.get('breakoutby')

    key = getKey()

    games_all = []

    if any(e in request.json.get('breakoutby') for e in ['season', 'passer_player_id']):
        games_b = {}

        for group_name, group_data in participation.groupby(key):
            games_b[group_name] = {}
            games_b[group_name][key] = group_name
            games_b[group_name]["routes"] = len(group_data)
            games_b[group_name]["games"] = group_data['game_id'].nunique()

        for group_name, group_data in targeted.groupby(key):

            games_b[group_name]["targets"] = len(group_data)
            games_b[group_name]["receptions"] = len(
                group_data[group_data['complete_pass'] == 1])
            games_b[group_name]["receiving_yards"] = group_data[group_data['complete_pass']
                                                                == 1]['receiving_yards'].sum()
            games_b[group_name]["touchdowns"] = group_data[group_data['complete_pass']
                                                           == 1]['pass_touchdown'].sum()
            games_b[group_name]["air_yards"] = group_data[group_data['receiver_player_id']
                                                          == player_id]['air_yards'].sum()

        games_all = list(games_b.values())
    elif request.json.get('breakoutby') == 'formation':

        for group in ['1 WR', '2 WR', '3 WR', '4 WR']:
            targeted_b = targeted[targeted['offense_personnel'].str.contains(
                group)]
            rec_b = targeted_b[targeted_b['complete_pass'] == 1]

            games_all.append({
                "formation": group,
                "games": participation[participation['offense_personnel'].str.contains(group)]['game_id'].nunique(),
                "routes": len(participation[participation['offense_personnel'].str.contains(group)]),
                "targets": len(targeted_b),
                "receptions": len(rec_b),
                "receiving_yards": rec_b['receiving_yards'].sum(),
                "touchdowns": rec_b['pass_touchdown'].sum(),
                "air_yards": df_range[
                    (df_range['receiver_player_id'] == player_id) &
                    (df_range['offense_personnel'].str.contains(group))
                ]['air_yards'].sum()
            })
    elif request.json.get('breakoutby') == 'aDot':
        targeted_under_5 = targeted[targeted['air_yards'] < 5]
        rec_under_5 = targeted_under_5[targeted_under_5['complete_pass'] == 1]

        games_all.append({
            "air_yards_range": "Under 5 Yd",
            "games": participation[participation['air_yards'] < 5]['game_id'].nunique(),
            "routes": len(participation[participation['air_yards'] < 5]),
            "targets": len(targeted_under_5),
            "receptions": len(rec_under_5),
            "receiving_yards": rec_under_5['receiving_yards'].sum(),
            "touchdowns": rec_under_5['pass_touchdown'].sum(),
            "air_yards": df_range[
                (df_range['receiver_player_id'] == player_id) &
                (df_range['air_yards'] < 5)
            ]['air_yards'].sum()
        })

        targeted_5_10 = targeted[(targeted['air_yards'] >= 5) & (
            participation['air_yards'] <= 10)]
        rec_5_10 = targeted_5_10[targeted_5_10['complete_pass'] == 1]

        games_all.append({
            "air_yards_range": "5-10 Yd",
            "games": participation[(participation['air_yards'] >= 5) & (participation['air_yards'] <= 10)]['game_id'].nunique(),
            "routes": len(participation[(participation['air_yards'] >= 5) & (participation['air_yards'] <= 10)]),
            "targets": len(targeted_5_10),
            "receptions": len(rec_5_10),
            "receiving_yards": rec_5_10['receiving_yards'].sum(),
            "touchdowns": rec_5_10['pass_touchdown'].sum(),
            "air_yards": df_range[
                (df_range['receiver_player_id'] == player_id) &
                (df_range['air_yards'] >= 5) &
                (participation['air_yards'] <= 10)
            ]['air_yards'].sum()
        })

        targeted_10_15 = targeted[(targeted['air_yards'] >= 10) & (
            participation['air_yards'] <= 15)]
        rec_10_15 = targeted_10_15[targeted_10_15['complete_pass'] == 1]

        games_all.append({
            "air_yards_range": "10-15 Yd",
            "games": participation[(participation['air_yards'] >= 5) & (participation['air_yards'] <= 10)]['game_id'].nunique(),
            "routes": len(participation[(participation['air_yards'] >= 5) & (participation['air_yards'] <= 10)]),
            "targets": len(targeted_10_15),
            "receptions": len(rec_10_15),
            "receiving_yards": rec_10_15['receiving_yards'].sum(),
            "touchdowns": rec_10_15['pass_touchdown'].sum(),
            "air_yards": df_range[
                (df_range['receiver_player_id'] == player_id) &
                (df_range['air_yards'] >= 10) &
                (participation['air_yards'] <= 15)
            ]['air_yards'].sum()
        })

        targeted_over_15 = targeted[targeted['air_yards'] > 15]
        rec_over_15 = targeted_over_15[targeted_over_15['complete_pass'] == 1]

        games_all.append({
            "air_yards_range": "Under 5 Yd",
            "games": participation[participation['air_yards'] > 15]['game_id'].nunique(),
            "routes": len(participation[participation['air_yards'] > 15]),
            "targets": len(targeted_over_15),
            "receptions": len(rec_over_15),
            "receiving_yards": rec_over_15['receiving_yards'].sum(),
            "touchdowns": rec_over_15['pass_touchdown'].sum(),
            "air_yards": df_range[
                (df_range['receiver_player_id'] == player_id) &
                (df_range['air_yards'] > 15)
            ]['air_yards'].sum()
        })

        targeted_5_10 = targeted[(targeted['air_yards'] >= 5) & (
            participation['air_yards'] <= 10)]
        rec_5_10 = targeted_5_10[targeted_5_10['complete_pass'] == 1]

    return jsonify(

        {
            **request.json,
            "routes": routes,
            "games": games,
            "targets": targets,
            "receptions": len(rec),
            "receiving_yards": rec_yds,
            "touchdowns": rec_td,
            "air_yards": air_yards,
            "player_breakoutby": games_all
        }
    )
