import os

from dagster import Definitions, load_assets_from_modules
from dagster_dbt import DbtCliResource, load_assets_from_dbt_project
from dagster_duckdb_pandas import DuckDBPandasIOManager

from . import assets, jobs

DBT_PROJECT_DIR = os.path.dirname(os.path.abspath(__file__)) + "/../dbt/"
DATA_DIR = os.path.dirname(os.path.abspath(__file__)) + "/../data/"

dbt = DbtCliResource(project_dir=DBT_PROJECT_DIR, profiles_dir=DBT_PROJECT_DIR)

dbt_assets = load_assets_from_dbt_project(DBT_PROJECT_DIR, DBT_PROJECT_DIR)
python_assets = load_assets_from_modules([assets])

resources = {
    "dbt": dbt,
    "io_manager": DuckDBPandasIOManager(database=DATA_DIR + "local.duckdb"),
}

defs = Definitions(
    assets=[*dbt_assets, *python_assets],
    resources=resources,
    jobs=[jobs.all_assets_job],
)
