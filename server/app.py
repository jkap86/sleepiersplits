from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import os
from modules.data.routes import data_blueprint
from modules.receiving.routes import receiving_blueprint
from modules.defense.routes import defense_blueprint

app = Flask(__name__)
CORS(app)

app = Flask(__name__, static_folder='../client/build', static_url_path='/')
app.register_blueprint(data_blueprint)
app.register_blueprint(receiving_blueprint)
app.register_blueprint(defense_blueprint)


@app.route('/receiving/top50', methods=['POST'])
def top50_receiving():
    statistic = request.json.get('statistic')
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

    result = {
        **request.json,
        "top50": []
    }

    top50 = df_range.groupby('receiver_player_id')[
        'receiving_yards'].sum().nlargest(50)
    top50 = top50.index.tolist()

    for receiver in top50:
        rec_data = df_range[df_range["receiver_player_id"] == receiver]

        result["top50"].append({
            "receiver_player_id": receiver,
            "air_yards": rec_data['air_yards'].sum(),
            "receiving_yards": rec_data['receiving_yards'].sum(),
            "complete_pass": rec_data['complete_pass'].sum(),
            "touchdowns": rec_data['pass_touchdown'].sum(),
            "targets": len(rec_data),
            "game_id": rec_data['game_id'].nunique(),
            "routes": len(df_range[
                (df_range['offense_players'].str.contains(receiver, na=False)) &
                (df_range['pass_attempt'] == 1)
            ])
        })

    return jsonify(result)


@app.route('/player/rushsummary', methods=['POST'])
def rushing():
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

    return jsonify({
        **request.json,
        "rushing_yards": df_range[df_range['rusher_player_id'] == player_id]['rushing_yards'].sum(),
        "carries": len(df_range[(df_range['rusher_player_id'] == player_id) & (df_range['rush_attempt'] == 1)]),
        "rushing_touchdowns": df_range[(df_range['rusher_player_id'] == player_id) & (df_range['rush_attempt'] == 1)]['rush_touchdown'].sum(),
        "receiving_yards": df_range[(df_range['receiver_player_id'] == player_id)]['receiving_yards'].sum(),
        "receptions": df_range[(df_range['receiver_player_id'] == player_id)]['complete_pass'].sum(),
        "receiving_touchdowns": df_range[df_range['receiver_player_id'] == player_id]['pass_touchdown'].sum(),
        "targets": len(df_range[df_range['receiver_player_id'] == player_id]),
        "games": df_range[df_range['receiver_player_id'] == player_id]['game_id'].nunique()
    })


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/<path>')
def catch_all(path):
    return app.send_static_file('index.html')


if __name__ == '__main__':

    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
