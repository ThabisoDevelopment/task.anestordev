create database tast_dev_db;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    email_verified TINYINT default(0),
    password VARCHAR(255) NOT NULL,
    img TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE tasks(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    completed tinyint default(0),
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    
    foreign key (user_id) references users(id) on update cascade on delete cascade
);

CREATE TABLE task_phases(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    completed tinyint default(0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    
    foreign key (user_id) references users(id),
    foreign key (task_id) references tasks(id) on update cascade on delete cascade
);

CREATE TABLE todos(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    has_phase tinyint default(0),
    phase_id INT NOT NULL default(0),
    name TEXT NOT NULL,
    description TEXT,
    notes TEXT,
    completed tinyint default(0),
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    
    foreign key (user_id) references users(id),
    foreign key (phase_id) references task_phases(id) on update cascade on delete cascade
);




