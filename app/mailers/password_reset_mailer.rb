class PasswordResetMailer < ApplicationMailer
  def reset(user)
    @user = user
    @reset_url = "#{app_url}/reset-password/#{user.password_reset_token}"

    mail(
      to: user.email,
      subject: "Reset your CoWrite password"
    )
  end

  private

  def app_url
    ENV.fetch("APP_URL", "http://localhost:3000")
  end
end
