
CREATE TABLE users (
    athlete_id SERIAL PRIMARY KEY,
    username VARCHAR(16) UNIQUE NOT NULL,
    password VARCHAR (64) NOT NULL
);

CREATE TABLE posts (
    post_id INT GENERATED ALWAYS AS IDENTITY,
    athlete_id INT,
    activity_name VARCHAR(32) NOT NULL,
    activity_date DATE,
    distance VARCHAR(32) NOT NULL,
    CONSTRAINT fk_athlete
      FOREIGN KEY(athlete_id) 
	  REFERENCES users(athlete_id)
);

INSERT INTO posts (athlete_id, activity_name, activity_date, distance) VALUES (1, 'Jog to the shops', '2023-11-09', 7);