from src import create_app

romskjema = create_app()
if __name__ == "__main__":
    romskjema.run(debug=True)
