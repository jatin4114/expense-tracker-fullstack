import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, changePassword, deleteAccount } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";
import "../components/common/Form.css";
import "./Profile.css";

function Profile() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      showToast("Password updated", "success");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError("Could not update password. Please try again.");
      }
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount(e) {
    e.preventDefault();
    setDeleteError("");
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setDeleteError("Incorrect password");
      } else {
        setDeleteError("Could not delete account. Please try again.");
      }
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="profile-page">
      <div className="card">
        <h2 className="section-title">Account</h2>
        <p className="profile-field">
          <strong>Email:</strong> {me.email}
        </p>
        <p className="profile-field">
          <strong>Member since:</strong> {new Date(me.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="card">
        <h2 className="section-title">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          {passwordError && <div className="form-top-error">{passwordError}</div>}
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="at least 6 characters"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={savingPassword}>
            {savingPassword ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="card danger-zone">
        <h2 className="section-title">Danger Zone</h2>
        <p className="profile-field">
          Deleting your account permanently removes all your expenses and budget data.
          This cannot be undone.
        </p>
        <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <Modal title="Delete Account" onClose={() => setShowDeleteModal(false)}>
          <form onSubmit={handleDeleteAccount}>
            {deleteError && <div className="form-top-error">{deleteError}</div>}
            <p>Enter your password to confirm. This cannot be undone.</p>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger" disabled={deleting}>
                {deleting ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Profile;
