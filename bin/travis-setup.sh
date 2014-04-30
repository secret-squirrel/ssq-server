#!/bin/sh
psql -c 'create database travis_ci_test;' -U postgres
cp config/config.travis.json config/config.json
npm install -g sequelize@2.0.0-dev10
sequelize -m
