class Api::Admin::InvitationsController < Api::Admin::BaseController
  def index
    invitations = Invitation.includes(:circle, :inviter)
                            .order(created_at: :desc)

    render json: invitations.map { |i| invitation_json(i) }
  end

  def show
    invitation = Invitation.includes(:circle, :inviter).find(params[:id])
    render json: invitation_json(invitation)
  end

  def impersonate
    invitation = Invitation.find(params[:id])

    # Find or create user by email
    user = User.find_by(email: invitation.email.downcase)

    if user.nil?
      # Auto-create user with random password
      user = User.create!(
        email: invitation.email,
        name: invitation.email.split("@").first.titleize,
        password: SecureRandom.urlsafe_base64(16)
      )
    end

    # Prevent impersonating super admins
    if user.is_super_admin
      return render json: { error: "Cannot impersonate a super admin user" }, status: :forbidden
    end

    # Generate token for the user
    token = JwtService.encode(user_id: user.id)

    render json: {
      message: "Now impersonating #{user.name} (#{invitation.email})",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_super_admin: user.is_super_admin
      },
      user_created: user.created_at > 1.minute.ago
    }
  end

  private

  def invitation_json(invitation)
    {
      id: invitation.id,
      email: invitation.email,
      token: invitation.token,
      status: invitation.status,
      expires_at: invitation.expires_at,
      expired: invitation.expired?,
      created_at: invitation.created_at,
      circle: {
        id: invitation.circle.id,
        name: invitation.circle.name
      },
      inviter: {
        id: invitation.inviter.id,
        name: invitation.inviter.name,
        email: invitation.inviter.email
      }
    }
  end
end
