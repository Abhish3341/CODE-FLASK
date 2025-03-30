// filepath: c:\Users\Abhinav Sharma\Desktop\CODE FLASK\Frontend\src\pages\GithubCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GithubCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGithubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (!code) {
        console.error("GitHub OAuth callback: Missing 'code' parameter");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/auth/github/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("GitHub OAuth callback: Success");
          
          // Store the token and login
          await login({ provider: 'github', token: data.accessToken });
          navigate("/dashboard");
        } else {
          const errorData = await response.json();
          console.error("GitHub OAuth callback failed:", errorData);
          navigate("/login");
        }
      } catch (error) {
        console.error("GitHub OAuth callback error:", error);
        navigate("/login");
      }
    };

    handleGithubCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Authenticating with GitHub...
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Please wait while we complete your sign-in.
        </p>
      </div>
    </div>
  );
};

export default GithubCallback;