import { useEffect, useRef, useState, type RefObject } from "react";
import {
  Edit,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  MapPin,
  Briefcase,
  Trophy,
  FileText,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Check,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";
import {
  getUserProfile,
  getMyJobs,
  getMyAchievements,
  updateUserProfile,
  updateJob,
  updateAchievement,
  uploadProfileImage,
  deleteProfileImage,
  type JobPost,
  type AchievementPost,
  type ProfileExperienceEntry,
  type UserProfile,
  type AcademicDetail,
} from "@/lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555";

const emptyExperience: ProfileExperienceEntry = {
  company: "",
  role: "",
  duration: "",
  description: "",
};

const initialProfileData: UserProfile = {
  id: 0,
  name: "John Doe",
  email: "john.doe@email.com",
  contact_number: "",
  academic_details: [],
  specialization: "",
  awards: [],
  honorary_degrees: [],
  books_authored: [],
  other_accolades: [],
  previous_experience: [],
  profile_image: null,
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>(initialProfileData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [myJobs, setMyJobs] = useState<JobPost[]>([]);
  const [myAchievements, setMyAchievements] = useState<AchievementPost[]>([]);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editingAchievementId, setEditingAchievementId] = useState<number | null>(null);
  const [jobDraft, setJobDraft] = useState<Partial<JobPost>>({
    company: "",
    role: "",
    location: "",
    job_type: "",
    salary: "",
    description: "",
    requirements: "",
    apply_link: "",
  });
  const [achievementDraft, setAchievementDraft] = useState<Partial<AchievementPost>>({
    title: "",
    description: "",
    image_url: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const awardsSectionRef = useRef<HTMLDivElement | null>(null);
  const educationSectionRef = useRef<HTMLDivElement | null>(null);
  const experienceSectionRef = useRef<HTMLDivElement | null>(null);
  const activitySectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void fetchProfile();
  }, []);

  async function fetchActivity() {
    const jobsResponse = await getMyJobs();
    if (jobsResponse.success) {
      setMyJobs(jobsResponse.data);
    }

    const achievementsResponse = await getMyAchievements();
    if (achievementsResponse.success) {
      setMyAchievements(achievementsResponse.data);
    }
  }

  function scrollToSection(ref: RefObject<HTMLDivElement | null>) {
    setIsEditing(true);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function fetchProfile() {
    setLoading(true);
    setError("");
    const response = await getUserProfile();

    if (!response.success) {
      setError(response.error || "Unable to load profile.");
      setLoading(false);
      return;
    }

    setProfileData({
      ...initialProfileData,
      ...response.data,
      awards: response.data.awards || [],
      honorary_degrees: response.data.honorary_degrees || [],
      books_authored: response.data.books_authored || [],
      other_accolades: response.data.other_accolades || [],
      previous_experience: response.data.previous_experience || [],
    });
    await fetchActivity();
    setLoading(false);
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    setMessage("");

    const response = await uploadProfileImage(file);
    if (response.success) {
      setProfileData((prev) => ({ ...prev, profile_image: response.data?.profile_image }));
      setMessage("Profile image updated successfully.");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setError(response.error || "Unable to upload image.");
    }
    setUploadingImage(false);
  }

  async function handleImageDelete() {
    if (!confirm("Are you sure you want to delete your profile image?")) return;

    setDeletingImage(true);
    setError("");
    setMessage("");

    const response = await deleteProfileImage();
    if (response.success) {
      setProfileData((prev) => ({ ...prev, profile_image: null }));
      setMessage("Profile image deleted.");
    } else {
      setError(response.error || "Unable to delete image.");
    }
    setDeletingImage(false);
  }

  function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function updateArrayItem(
    key: keyof Pick<
      UserProfile,
      "awards" | "honorary_degrees" | "books_authored" | "other_accolades"
    >,
    index: number,
    value: string
  ) {
    setProfileData((prev) => {
      const copy = [...prev[key]];
      copy[index] = value;
      return { ...prev, [key]: copy };
    });
  }

  function addArrayItem(
    key: keyof Pick<
      UserProfile,
      "awards" | "honorary_degrees" | "books_authored" | "other_accolades"
    >
  ) {
    setProfileData((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  }

  function removeArrayItem(
    key: keyof Pick<
      UserProfile,
      "awards" | "honorary_degrees" | "books_authored" | "other_accolades"
    >,
    index: number
  ) {
    setProfileData((prev) => {
      const copy = [...prev[key]];
      copy.splice(index, 1);
      return { ...prev, [key]: copy };
    });
  }

  function updateExperience(index: number, field: keyof ProfileExperienceEntry, value: string) {
    setProfileData((prev) => {
      const copy = [...prev.previous_experience];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, previous_experience: copy };
    });
  }

  function addExperience() {
    setProfileData((prev) => ({
      ...prev,
      previous_experience: [...prev.previous_experience, emptyExperience],
    }));
  }

  function removeExperience(index: number) {
    setProfileData((prev) => {
      const copy = [...prev.previous_experience];
      copy.splice(index, 1);
      return { ...prev, previous_experience: copy };
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      awards: profileData.awards.filter(Boolean),
      honorary_degrees: profileData.honorary_degrees.filter(Boolean),
      books_authored: profileData.books_authored.filter(Boolean),
      other_accolades: profileData.other_accolades.filter(Boolean),
      previous_experience: profileData.previous_experience.filter((entry) =>
        entry.company || entry.role || entry.duration || entry.description
      ),
    };

    const response = await updateUserProfile(payload);
    if (!response.success) {
      setError(response.error || "Unable to save profile data.");
      setSaving(false);
      return;
    }

    setMessage("Profile updates saved successfully.");
    setSaving(false);
    setIsEditing(false);
  }

  const currentCompany = profileData.previous_experience[0]?.company?.trim() || "";
  const currentRole = profileData.previous_experience[0]?.role?.trim() || "";
  const batchYear = profileData.academic_details[0]?.joining_year;
  const profileSubtitle = profileData.specialization || profileData.academic_details[0]?.degree || "Alumni";

  const displayName = profileData.name || "Alumni";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="relative flex flex-col lg:flex-row items-center gap-6">
          <div className="relative w-28 h-28 rounded-full border border-white/25 bg-white/10 flex items-center justify-center text-4xl font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden">
            {profileData.profile_image ? (
              <img
                src={`${API_BASE_URL}/profile-images/${profileData.profile_image}`}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
            {isEditing && (
              <>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </label>
                {profileData.profile_image && (
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    disabled={deletingImage}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                    title="Delete profile image"
                  >
                    {deletingImage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-4xl font-semibold mb-3 leading-tight">{displayName}</h3>
            <p className="text-blue-100 text-lg mb-5 max-w-2xl">{profileSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              {currentRole ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm">
                  <Briefcase className="w-4 h-4 text-white" />
                  {currentRole}
                </span>
              ) : null}
              {currentCompany ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm">
                  <FileText className="w-4 h-4 text-white" />
                  {currentCompany}
                </span>
              ) : null}
              {batchYear ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-white" />
                  Batch {batchYear}
                </span>
              ) : null}
            </div>
          </div>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25 transition"
          >
            <span className="inline-flex items-center gap-2">
              <Edit className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600">
          Loading profile...
        </div>
      ) : (
        <>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Professional Snapshot</h2>
                  <p className="text-sm text-gray-500">
                    Add your most important accolades and experience so your network can learn about your impact.
                  </p>
                </div>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Check className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Updates"}
                  </button>
                )}
              </div>

              <section className="space-y-5">
                <div ref={educationSectionRef} className="rounded-3xl border border-gray-200 p-5 bg-slate-50">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                      <GraduationCap className="w-5 h-5 text-slate-700" />
                      Education
                    </div>
                  </div>

                  {profileData.academic_details.length === 0 ? (
                    <p className="text-sm text-gray-500">No education details added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {profileData.academic_details.map((edu, index) => (
                        <div key={`edu-${index}`} className="rounded-3xl border border-gray-200 bg-white p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1 grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Degree</p>
                                <p className="text-sm font-medium text-slate-900">{edu.degree}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Branch</p>
                                <p className="text-sm font-medium text-slate-900">{edu.branch || "Not specified"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">College</p>
                                <p className="text-sm font-medium text-slate-900">{edu.college_name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Batch</p>
                                <p className="text-sm font-medium text-slate-900">{edu.joining_year}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div ref={experienceSectionRef} className="rounded-3xl border border-gray-200 p-5 bg-slate-50">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                      <Briefcase className="w-5 h-5 text-slate-700" />
                      Experience
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={addExperience}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
                      >
                        <Plus className="w-4 h-4" />
                        Add Experience
                      </button>
                    )}
                  </div>

                  {profileData.previous_experience.length === 0 ? (
                    <p className="text-sm text-gray-500">No previous experience added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {profileData.previous_experience.map((experience, index) => (
                        <div key={`${experience.company}-${index}`} className="rounded-3xl border border-gray-200 bg-white p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 flex-1">
                              <FieldInput
                                label="Company"
                                value={experience.company}
                                disabled={!isEditing}
                                onChange={(value) => updateExperience(index, "company", value)}
                              />
                              <FieldInput
                                label="Role"
                                value={experience.role}
                                disabled={!isEditing}
                                onChange={(value) => updateExperience(index, "role", value)}
                              />
                              <FieldInput
                                label="Duration"
                                value={experience.duration}
                                disabled={!isEditing}
                                onChange={(value) => updateExperience(index, "duration", value)}
                              />
                            </div>
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                                aria-label="Remove experience"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-500 mb-2">Description</label>
                            {isEditing ? (
                              <textarea
                                value={experience.description}
                                onChange={(event) => updateExperience(index, "description", event.target.value)}
                                className="min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Add a short note about this role"
                              />
                            ) : (
                              <p className="text-sm text-slate-600">{experience.description || "No description added."}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div ref={awardsSectionRef}>
                  <ProfileListSection
                    title="Awards"
                    icon={<Trophy className="w-5 h-5 text-blue-600" />}
                    items={profileData.awards}
                    isEditing={isEditing}
                    emptyLabel="No awards added yet"
                    onChange={(index, value) => updateArrayItem("awards", index, value)}
                    onAdd={() => addArrayItem("awards")}
                    onRemove={(index) => removeArrayItem("awards", index)}
                  />
                </div>

                <ProfileListSection
                  title="Honorary Degrees"
                  icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
                  items={profileData.honorary_degrees}
                  isEditing={isEditing}
                  emptyLabel="No honorary degrees added yet"
                  onChange={(index, value) => updateArrayItem("honorary_degrees", index, value)}
                  onAdd={() => addArrayItem("honorary_degrees")}
                  onRemove={(index) => removeArrayItem("honorary_degrees", index)}
                />

                <ProfileListSection
                  title="Books Authored"
                  icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
                  items={profileData.books_authored}
                  isEditing={isEditing}
                  emptyLabel="No books added yet"
                  onChange={(index, value) => updateArrayItem("books_authored", index, value)}
                  onAdd={() => addArrayItem("books_authored")}
                  onRemove={(index) => removeArrayItem("books_authored", index)}
                />

                <ProfileListSection
                  title="Other Accolades"
                  icon={<StarBadgeIcon />}
                  items={profileData.other_accolades}
                  isEditing={isEditing}
                  emptyLabel="No additional accolades yet"
                  onChange={(index, value) => updateArrayItem("other_accolades", index, value)}
                  onAdd={() => addArrayItem("other_accolades")}
                  onRemove={(index) => removeArrayItem("other_accolades", index)}
                />
              </section>

              {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
              {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Summary</h2>
              <div className="space-y-4">
                <DetailRow icon={<Mail className="w-5 h-5 text-gray-400" />} label="Email" value={profileData.email || "Not added"} />
                <DetailRow icon={<Phone className="w-5 h-5 text-gray-400" />} label="Phone" value={profileData.contact_number || "Not added"} />
                <DetailRow icon={<Briefcase className="w-5 h-5 text-gray-400" />} label="Specialization" value={profileData.specialization || "Not added"} />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection(awardsSectionRef)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Update awards and recognition
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(experienceSectionRef)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Add experience details
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(educationSectionRef)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View education details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity Summary</h3>
              <div className="space-y-3">
                <div className="rounded-3xl bg-blue-50 p-4">
                  <p className="text-sm text-gray-500">Job posts</p>
                  <p className="text-3xl font-bold text-blue-700">{myJobs.length}</p>
                </div>
                <div className="rounded-3xl bg-amber-50 p-4">
                  <p className="text-sm text-gray-500">Achievements</p>
                  <p className="text-3xl font-bold text-amber-700">{myAchievements.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Total activity</p>
                  <p className="text-3xl font-bold text-slate-900">{myJobs.length + myAchievements.length}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Edit your latest job posts and achievements directly from your profile.</p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection(activitySectionRef)}
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Jump to activity
                </button>
              </div>

              {(myJobs.length === 0 && myAchievements.length === 0) ? (
                <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                  No recent activity yet. Share a job or achievement to see it here.
                </div>
              ) : (
                <div className="space-y-5" ref={activitySectionRef}>
                  {myJobs.map((job) => (
                    <div key={`job-${job.id}`} className="rounded-3xl border-2 border-blue-400 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-blue-700 font-semibold">Job Post</p>
                          <h4 className="text-lg font-semibold text-gray-900">{job.role} at {job.company}</h4>
                          <p className="text-sm text-gray-600">{job.location} • {job.job_type}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingJobId(job.id);
                            setEditingAchievementId(null);
                            setJobDraft({
                              company: job.company,
                              role: job.role,
                              location: job.location,
                              job_type: job.job_type,
                              salary: job.salary,
                              description: job.description,
                              requirements: job.requirements,
                              apply_link: job.apply_link,
                            });
                          }}
                          className="rounded-2xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>
                      </div>

                      {editingJobId === job.id ? (
                        <div className="mt-5 grid gap-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FieldInput label="Company" value={jobDraft.company || ""} disabled={false} onChange={(value) => setJobDraft((prev) => ({ ...prev, company: value }))} />
                            <FieldInput label="Role" value={jobDraft.role || ""} disabled={false} onChange={(value) => setJobDraft((prev) => ({ ...prev, role: value }))} />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FieldInput label="Location" value={jobDraft.location || ""} disabled={false} onChange={(value) => setJobDraft((prev) => ({ ...prev, location: value }))} />
                            <FieldInput label="Job type" value={jobDraft.job_type || ""} disabled={false} onChange={(value) => setJobDraft((prev) => ({ ...prev, job_type: value }))} />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FieldInput label="Salary" value={jobDraft.salary || ""} disabled={false} onChange={(value) => setJobDraft((prev) => ({ ...prev, salary: value }))} />
                            <FieldInput label="Apply link" value={jobDraft.apply_link || ""} disabled={false} onChange={(value) => setJobDraft((prev) => ({ ...prev, apply_link: value }))} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Description</label>
                            <textarea
                              value={jobDraft.description || ""}
                              onChange={(event) => setJobDraft((prev) => ({ ...prev, description: event.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Requirements</label>
                            <textarea
                              value={jobDraft.requirements || ""}
                              onChange={(event) => setJobDraft((prev) => ({ ...prev, requirements: event.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={async () => {
                                const response = await updateJob(job.id, {
                                  company: jobDraft.company,
                                  role: jobDraft.role,
                                  location: jobDraft.location,
                                  job_type: jobDraft.job_type,
                                  salary: jobDraft.salary,
                                  description: jobDraft.description,
                                  requirements: jobDraft.requirements,
                                  apply_link: jobDraft.apply_link,
                                });
                                if (response.success) {
                                  await fetchActivity();
                                  setEditingJobId(null);
                                  setMessage("Job updated successfully.");
                                  setError("");
                                } else {
                                  setError(response.error || "Unable to update job.");
                                }
                              }}
                              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Save Job
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingJobId(null)}
                              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {myAchievements.map((achievement) => (
                    <div key={`achievement-${achievement.id}`} className="rounded-3xl border-2 border-amber-400 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-amber-700 font-semibold">Achievement</p>
                          <h4 className="text-lg font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">Posted by {achievement.poster_name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAchievementId(achievement.id);
                            setEditingJobId(null);
                            setAchievementDraft({
                              title: achievement.title,
                              description: achievement.description,
                              image_url: achievement.image_url,
                            });
                          }}
                          className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                        >
                          Edit
                        </button>
                      </div>

                      {achievement.image_url && (
                        <div className="mt-3">
                          <img src={achievement.image_url} alt={achievement.title} className="h-32 w-auto rounded-xl object-cover" />
                        </div>
                      )}

                      {editingAchievementId === achievement.id ? (
                        <div className="mt-5 grid gap-4">
                          <FieldInput label="Title" value={achievementDraft.title || ""} disabled={false} onChange={(value) => setAchievementDraft((prev) => ({ ...prev, title: value }))} />
                          <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Description</label>
                            <textarea
                              value={achievementDraft.description || ""}
                              onChange={(event) => setAchievementDraft((prev) => ({ ...prev, description: event.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Image</label>
                            {achievementDraft.image_url && (
                              <div className="mb-2">
                                <img src={achievementDraft.image_url} alt="Current" className="h-24 w-auto rounded-xl object-cover border border-amber-300" />
                                <p className="text-xs text-amber-600 mt-1">Current image preview</p>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <label className="cursor-pointer rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setAchievementDraft((prev) => ({ ...prev, image_url: reader.result as string }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                Choose File
                              </label>
                              <span className="text-sm text-gray-500">{achievementDraft.image_url ? "Image selected" : "No file chosen"}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={async () => {
                                const response = await updateAchievement(achievement.id, {
                                  title: achievementDraft.title,
                                  description: achievementDraft.description,
                                  image_url: achievementDraft.image_url ?? undefined,
                                });
                                if (response.success) {
                                  await fetchActivity();
                                  setEditingAchievementId(null);
                                  setMessage("Achievement updated successfully.");
                                  setError("");
                                } else {
                                  setError(response.error || "Unable to update achievement.");
                                }
                              }}
                              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Save Achievement
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingAchievementId(null)}
                              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

function ProfileListSection({
  title,
  icon,
  items,
  isEditing,
  emptyLabel,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  isEditing: boolean;
  emptyLabel: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
          {icon}
          {title}
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${title}-${index}`} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-3">
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(event) => onChange(index, event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder={`Add ${title.slice(0, -1).toLowerCase()}`}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-700">{item}</p>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                  aria-label={`Remove ${title} item`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-500 mb-2">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StarBadgeIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
      <Sparkles className="w-5 h-5" />
    </div>
  );
}
