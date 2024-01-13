from flask import Blueprint, request, jsonify, render_template
from models import db, User
from appFactory import bcrypt
import logging

create_auth_blueprint = Blueprint('create_auth_blueprint', __name__)

@create_auth_blueprint.route('/create-account', methods=['POST'])
def create_account():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'Username or email already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create new user
    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    try:
        db.session.commit()
        logging.info(f"New user created: {username}")
        return jsonify({'success': True, 'message': 'Account created successfully'})
    except Exception as e:
        db.session.rollback()  # Roll back the session in case of error
        logging.error(f"Error creating user: {e}")
        return jsonify({'success': False, 'message': 'Failed to create account'}), 500

@create_auth_blueprint.route('/createAccount')
def create_account_page():
    return render_template('createAccount.html')
