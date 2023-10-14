from flask import Blueprint, jsonify
import os
import requests
import pandas as pd
import logging
import io


data_blueprint = Blueprint('users', __name__)


@data_blueprint.route('/cleanfile/<int:season>')
def cleanfile(season):
    try:
        columns1 = [
            "play_id",
            "game_id",
            "week",
            "season",
            "season_type",
            "air_yards",
            "interception",
            "rush_attempt",
            "pass_attempt",
            "sack",
            "touchdown",
            "pass_touchdown",
            "rush_touchdown",
            "complete_pass",
            "passer_player_id",
            "passing_yards",
            "receiver_player_id",
            "receiving_yards",
            "rusher_player_id",
            "rushing_yards",
            "yrdln",
            "ydstogo",
            "home_team",
            "away_team",
            "posteam",
            "defteam",
            "posteam_score",
            "defteam_score",
            "down",
            "desc"
        ]

        columns2 = [
            "play_id",
            "game_id",
            'offense_personnel',
            'offense_players',
            'defenders_in_box',
            'defense_personnel',
            'defense_players'
        ]

        input_file_url1 = f'https://github.com/nflverse/nflverse-data/releases/download/pbp/play_by_play_{season}.csv.gz'
        input_file_url2 = f'https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_{season}.csv'
        output_file_path = f'./all_pbp.csv.gz'

        response1 = requests.get(input_file_url1)
        response1.raise_for_status()

        df1 = pd.read_csv(io.BytesIO(response1.content),
                          compression='gzip', low_memory=False)
        df1 = df1[columns1]

        response2 = requests.get(input_file_url2)
        response2.raise_for_status()

        df2 = pd.read_csv(io.StringIO(response2.text))
        df2 = df2.rename(columns={"nflverse_game_id": "game_id"})
        df2 = df2[columns2]

        df = pd.merge(df1, df2, on=['play_id', 'game_id'], how='inner')

        if os.path.exists(output_file_path):
            logging.info(f"Reading from {output_file_path}")
            df_all = pd.read_csv(output_file_path, compression='gzip')
            df_all_updated = pd.concat([df_all, df], ignore_index=True)
        else:
            logging.info(
                f"{output_file_path} does not exist. Using df directly.")
            df_all_updated = df

        df_all_updated = df_all_updated.drop_duplicates()

        df_all_updated.to_csv(
            output_file_path, compression='gzip', index=False)

        return jsonify({"message": f"File for {season} processed successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
