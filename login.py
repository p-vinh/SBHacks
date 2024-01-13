# login.py
from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session
from models import User
from appFactory import bcrypt, login_required
from flask_bcrypt import check_password_hash

login_blueprint = Blueprint('login_blueprint', __name__)

@login_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            # User exists and password is correct
            session['user_id'] = user.id 
            return jsonify({'success': True, 'redirect': '/welcome'})
        else:
            # User doesn't exist or password is incorrect
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
    
    # For GET request, render the login page
    return render_template('login.html')

@login_blueprint.route('/')
def index():
    # Redirects to the login page
    return render_template('login.html')

@login_blueprint.route('/welcome')
@login_required
def welcome():
    return render_template('welcome.html')

@login_blueprint.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login_blueprint.login'))