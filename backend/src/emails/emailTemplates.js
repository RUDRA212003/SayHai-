export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SayHi</title>
    <style>
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animated-content {
        animation: fadeInUp 0.8s ease-out;
      }
      .cta-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(91, 134, 229, 0.4);
      }
    </style>
  </head>
  <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #2d3436; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fbfd;">
    <div class="animated-content" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
      
      <div style="background: linear-gradient(135deg, #00B4DB 0%, #0083B0 100%); padding: 40px 20px; text-align: center;">
        <div style="background: white; width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
           <span style="font-size: 40px;">👋</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Time to SayHi!</h1>
      </div>

      <div style="padding: 40px;">
        <p style="font-size: 20px; font-weight: 600; color: #0083B0; margin-top: 0;">Hey ${name}!</p>
        <p style="font-size: 16px; color: #636e72;">The world just got a little smaller. We're thrilled to have you in the <strong>SayHi</strong> community—the place where conversations actually feel like conversations.</p>
        
        <div style="margin: 30px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 15px; background: #f1f7ff; padding: 15px; border-radius: 12px;">
            <span style="font-size: 24px; margin-right: 15px;">🚀</span>
            <span style="font-size: 15px; color: #2d3436;"><strong>Lightning Fast:</strong> No lag, just instant connection.</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 15px; background: #f1f7ff; padding: 15px; border-radius: 12px;">
            <span style="font-size: 24px; margin-right: 15px;">🔒</span>
            <span style="font-size: 15px; color: #2d3436;"><strong>Secure & Private:</strong> Your chats stay between you and your friends.</span>
          </div>
          <div style="display: flex; align-items: center; background: #f1f7ff; padding: 15px; border-radius: 12px;">
            <span style="font-size: 24px; margin-right: 15px;">🎨</span>
            <span style="font-size: 15px; color: #2d3436;"><strong>Express Yourself:</strong> Stickers, reactions, and high-res media.</span>
          </div>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${clientURL}" class="cta-button" style="background: #0083B0; color: white; text-decoration: none; padding: 18px 45px; border-radius: 15px; font-weight: 600; font-size: 18px; display: inline-block; transition: all 0.3s ease;">Jump into Chat</a>
        </div>

        <p style="text-align: center; color: #b2bec3; font-size: 14px;">Need a hand? Just reply to this email, we're here to help.</p>
      </div>

      <div style="background-color: #f1f2f6; padding: 30px; text-align: center;">
        <p style="margin: 0; font-weight: 600; color: #2d3436; font-size: 16px;">SayHi</p>
        <p style="color: #636e72; font-size: 12px; margin: 10px 0 20px;">123 Digital Avenue, Cloud City, 10101</p>
        <div style="margin-bottom: 20px;">
          <a href="#" style="color: #0083B0; text-decoration: none; margin: 0 12px; font-size: 13px;">Privacy</a>
          <a href="#" style="color: #0083B0; text-decoration: none; margin: 0 12px; font-size: 13px;">Support</a>
          <a href="#" style="color: #0083B0; text-decoration: none; margin: 0 12px; font-size: 13px;">Unsubscribe</a>
        </div>
        <p style="color: #b2bec3; font-size: 11px; margin: 0;">© 2026 SayHi Inc. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}