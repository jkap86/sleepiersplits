from flask import Blueprint, jsonify, request
import pandas as pd

defense_blueprint = Blueprint('defense', __name__)


@defense_blueprint.route('/teamdefense')
def defense():
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

    teams = df_range['defteam'].unique.tolist()

    df_defteam = df_range.groupby('defteam')

    receiving_yards_dict = df_defteam['receiving_yards'].sum().to_dict()
    rushing_yards_dict = df_defteam['rushing_yards'].sum().to_dict()

    result = {}

    for team in teams:
        result[team] = {
            "receiving_yards": receiving_yards_dict.get(team, 0),
            "rushing_yards": rushing_yards_dict.get(team, 0)
        }

    return jsonify(teams)
