# To run the server... 

### Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

### Create the database
``` bash
sudo service postgresql start
sudo service postgresql status # check whether it's running
sudo -u postgres psql # open command-line interface
```

now enter:
``` sql
CREATE USER tracker WITH PASSWORD 'tracker';
CREATE DATABASE tracker OWNER tracker;
```
This creates a database named tracker that the Python backend can use.

exit: ``` \q ```

make sure the .env file matches:
```
DATABASE_URL=postgresql+psycopg://tracker:tracker@localhost:5432/tracker
DEVICE_API_KEY=your-secret-api-key
```
port 5432 is default PostgreSQL port

### Verify PostgreSQL works
``` bash
psql -h localhost -U tracker -d tracker
```
and enter the password: tracker

check database tables ``` \dt ```
exit with ``` \q ```

### Create Python virtual enviornment and install dependencies
```  bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Create dispenser table
``` bash
python -c "from app.database import Base, engine; import app.models; Base.metadata.create_all(bind=engine)"
```

### Start FastAPI
``` bash
uvicorn app.main:app --reload
```
Open http://localhost:8000/docs in browser

### Note for future development: 
We will need to configure network access from the ESP32 to the FastAPI server running inside WSL 2. This will require mirrored networking or Windows port forwarding.





# PostgreSQL terminal commands
``` bash
sudo service postgresql start
sudo service postgresql stop
sudo service postgresql restart
sudo service postgresql status
```

Important: Stopping PostgreSQL does not delete your database. It simply stops accepting connections until you start it again.


To open a client that connects to PostgreSQL server:

psql -h localhost -U tracker -d tracker

To exit run: ``` \q ```
This disconnects your terminal from PostgreSQL, but the PostgreSQL server keeps running.