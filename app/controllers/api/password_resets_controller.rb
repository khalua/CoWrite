class Api::PasswordResetsController < Api::BaseController
  skip_before_action :authenticate_user!

  # POST /api/auth/forgot-password
  def create
    user = User.find_by(email: params[:email]&.downcase)

    if user
      user.generate_password_reset_token!
      PasswordResetMailer.reset(user).deliver_later
    end

    # Always return success to prevent email enumeration
    render json: { message: "If an account with that email exists, we've sent password reset instructions." }
  end

  # GET /api/auth/reset-password/:token
  def show
    user = User.find_by_password_reset_token(params[:token])

    if user
      render json: { valid: true, email: user.email }
    else
      render json: { valid: false, error: "Invalid or expired reset link" }, status: :unprocessable_entity
    end
  end

  # POST /api/auth/reset-password/:token
  def update
    user = User.find_by_password_reset_token(params[:token])

    if user.nil?
      render json: { error: "Invalid or expired reset link" }, status: :unprocessable_entity
      return
    end

    if user.update(password: params[:password])
      user.clear_password_reset_token!
      render json: { message: "Password has been reset successfully" }
    else
      render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end
end
