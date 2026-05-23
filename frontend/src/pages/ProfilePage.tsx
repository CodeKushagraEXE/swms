import { useEffect, useRef, useState } from 'react';
import { profileApi } from '../services/api';
import { User, UpdateProfilePayload } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { updateUser } from '../store/slices/authSlice';
import UserAvatar from '../components/common/UserAvatar';
import { LoadingScreen } from '../components/common/Spinner';
import toast from 'react-hot-toast';

const emptyForm = (profile: User | null): UpdateProfilePayload => ({
  name: profile?.name || '',
  phone: profile?.phone || '',
  bio: profile?.bio || '',
  website: profile?.website || '',
  linkedinUrl: profile?.linkedinUrl || '',
  githubUrl: profile?.githubUrl || '',
});

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(s => s.auth.user);
  const [profile, setProfile] = useState<User | null>(null);
  const [form, setForm] = useState<UpdateProfilePayload>(emptyForm(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    profileApi.get()
      .then(r => {
        setProfile(r.data);
        setForm(emptyForm(r.data));
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const { data } = await profileApi.update({
        ...form,
        name: form.name.trim(),
      });
      setProfile(data);
      dispatch(updateUser(data));
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result as string;
      setUploading(true);
      try {
        const { data } = await profileApi.uploadAvatar(imageData);
        setProfile(data);
        dispatch(updateUser(data));
        toast.success('Profile photo updated');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to upload photo');
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    setUploading(true);
    try {
      const { data } = await profileApi.removeAvatar();
      setProfile(data);
      dispatch(updateUser(data));
      toast.success('Profile photo removed');
    } catch {
      toast.error('Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!profile) return <div className="text-center text-gray-500 py-20">Could not load profile</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and links</p>
      </div>

      {/* Photo card */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Profile photo</h2>
        <div className="flex flex-wrap items-center gap-6">
          <UserAvatar user={profile} size="xl" />
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              className="btn-primary"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? 'Uploading…' : 'Upload photo'}
            </button>
            {profile.profileImageUrl && (
              <button
                type="button"
                className="btn-secondary block"
                disabled={uploading}
                onClick={handleRemovePhoto}
              >
                Remove photo
              </button>
            )}
            <p className="text-xs text-gray-400">JPG, PNG or WebP · max 2MB</p>
          </div>
        </div>
      </div>

      {/* Details form */}
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <h2 className="text-lg font-semibold">Personal details</h2>

        <div>
          <label className="label">Full name</label>
          <input
            className="input"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Email</label>
          <input className="input bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed" value={profile.email} disabled />
          <p className="text-xs text-gray-400 mt-1">Email is tied to your login and cannot be changed here.</p>
        </div>

        <div>
          <label className="label">Phone number</label>
          <input
            className="input"
            type="tel"
            placeholder="+1 555 123 4567"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Bio</label>
          <textarea
            className="input min-h-[100px] resize-y"
            placeholder="A short intro about your role and focus…"
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            maxLength={500}
          />
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Links</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Website</label>
              <input
                className="input"
                type="url"
                placeholder="https://your-site.com"
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
              />
            </div>
            <div>
              <label className="label">LinkedIn</label>
              <input
                className="input"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={form.linkedinUrl}
                onChange={e => setForm({ ...form, linkedinUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="label">GitHub</label>
              <input
                className="input"
                type="url"
                placeholder="https://github.com/username"
                value={form.githubUrl}
                onChange={e => setForm({ ...form, githubUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
            {authUser?.role}
          </span>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
