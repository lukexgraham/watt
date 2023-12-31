
CREATE TABLE users (
    athlete_id SERIAL PRIMARY KEY,
    username VARCHAR(16) UNIQUE NOT NULL,
    password VARCHAR (64) NOT NULL,
    sex CHAR(1),
    weight SMALLINT,
    strava_id INT,
    country VARCHAR(64)
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    strava_id BIGINT,
    athlete_id INT NOT NULL,
    activity_name VARCHAR(32) NOT NULL,
    location_country VARCHAR(64),
    start_date DATE,
    distance INT,
    duration INT NOT NULL,
    sport_type VARCHAR(32),
    CONSTRAINT fk_athlete
      FOREIGN KEY(athlete_id) 
	  REFERENCES users(athlete_id)
);

CREATE TABLE streams (
    stream_id SERIAL PRIMARY KEY,
    post_id INT,
    coords VARCHAR(50) [],
    elevation INT [],
    power SMALLINT [],
    hr SMALLINT [],
    time VARCHAR[30],
    cadence SMALLINT [],
    CONSTRAINT fk_post
      FOREIGN KEY(post_id)
      REFERENCES posts(post_id)
);

INSERT INTO posts (athlete_id, activity_name, activity_date, distance) VALUES (1, 'Jog to the shops', '2023-11-09', 7);

SELECT posts.*
FROM posts
WHERE posts.athlete_id = ANY(SELECT unnest(following) FROM users WHERE athlete_id = 3);