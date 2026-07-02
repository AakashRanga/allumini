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
  IndianRupee,
  ExternalLink,
  Globe,
} from "lucide-react";
import {
  getUserProfile,
  getMyJobs,
  getMyAchievements,
  updateUserProfile,
  updateJob,
  updateAchievement,
  deleteJob,
  deleteAchievement,
  uploadProfileImage,
  deleteProfileImage,
  type JobPost,
  type AchievementPost,
  type ProfileExperienceEntry,
  type UserProfile,
  type AcademicDetail,
  type BookAuthoredEntry,
  type ExternalLinkEntry,
  API_BASE_URL,
} from "@/lib/api";
import { validateJobPost, JobValidationError, validateUserProfile, ProfileValidationError } from "@/utils/validation";


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
  external_links: [],
  publications: [],
  research: [],
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>(initialProfileData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileErrors, setProfileErrors] = useState<ProfileValidationError>({});

  const [myJobs, setMyJobs] = useState<JobPost[]>([]);
  const [myAchievements, setMyAchievements] = useState<AchievementPost[]>([]);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editingAchievementId, setEditingAchievementId] = useState<number | null>(null);
  const [profileJobErrors, setProfileJobErrors] = useState<JobValidationError>({});
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
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    type: "job" | "achievement";
    id: number;
    title: string;
  } | null>(null);
  const [savingJobId, setSavingJobId] = useState<number | null>(null);
  const [savingAchievementId, setSavingAchievementId] = useState<number | null>(null);

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

  async function handleDeleteConfirmSubmit() {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    setDeleteConfirm(null);
    
    if (type === "job") {
      const response = await deleteJob(id);
      if (response.success) {
        await fetchActivity();
        setMessage("Job posting deleted successfully.");
        setError("");
      } else {
        setError(response.error || "Failed to delete job posting.");
      }
    } else {
      const response = await deleteAchievement(id);
      if (response.success) {
        await fetchActivity();
        setMessage("Achievement deleted successfully.");
        setError("");
      } else {
        setError(response.error || "Failed to delete achievement.");
      }
    }
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

    const rawBooks = response.data.books_authored || [];
    const books = rawBooks.map((b: any) => {
      if (typeof b === "string") return { title: b, link: "" };
      return { title: b.title || "", link: b.link || "" };
    });

    const rawLinks = response.data.external_links || [];
    const links = rawLinks.map((l: any) => {
      if (typeof l === "string") return { title: "Link", url: l };
      return { title: l.title || "", url: l.url || "" };
    });

    setProfileData({
      ...initialProfileData,
      ...response.data,
      awards: response.data.awards || [],
      honorary_degrees: response.data.honorary_degrees || [],
      books_authored: books,
      other_accolades: response.data.other_accolades || [],
      previous_experience: response.data.previous_experience || [],
      external_links: links,
      publications: response.data.publications || [],
      research: response.data.research || [],
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
      "awards" | "honorary_degrees" | "other_accolades" | "publications" | "research"
    >,
    index: number,
    value: string
  ) {
    setProfileData((prev) => {
      const copy = [...(prev[key] as string[] || [])];
      copy[index] = value;
      return { ...prev, [key]: copy };
    });
  }

  function addArrayItem(
    key: keyof Pick<
      UserProfile,
      "awards" | "honorary_degrees" | "other_accolades" | "publications" | "research"
    >
  ) {
    setProfileData((prev) => ({ ...prev, [key]: [...(prev[key] as string[] || []), ""] }));
  }

  function removeArrayItem(
    key: keyof Pick<
      UserProfile,
      "awards" | "honorary_degrees" | "other_accolades" | "publications" | "research"
    >,
    index: number
  ) {
    setProfileData((prev) => {
      const copy = [...(prev[key] as string[] || [])];
      copy.splice(index, 1);
      return { ...prev, [key]: copy };
    });
  }

  // Books Authored helpers
  function updateBookItem(index: number, field: keyof BookAuthoredEntry, value: string) {
    setProfileData((prev) => {
      const copy = [...(prev.books_authored as BookAuthoredEntry[] || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, books_authored: copy };
    });
  }

  function addBookItem() {
    setProfileData((prev) => ({
      ...prev,
      books_authored: [...(prev.books_authored as BookAuthoredEntry[] || []), { title: "", link: "" }],
    }));
  }

  function removeBookItem(index: number) {
    setProfileData((prev) => {
      const copy = [...(prev.books_authored as BookAuthoredEntry[] || [])];
      copy.splice(index, 1);
      return { ...prev, books_authored: copy };
    });
  }

  // External Links helpers
  function updateExternalLinkItem(index: number, field: keyof ExternalLinkEntry, value: string) {
    setProfileData((prev) => {
      const copy = [...(prev.external_links as ExternalLinkEntry[] || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, external_links: copy };
    });
  }

  // Define add link helper
  function addExternalLinkItem() {
    setProfileData((prev) => ({
      ...prev,
      external_links: [...(prev.external_links as ExternalLinkEntry[] || []), { title: "", url: "" }],
    }));
  }

  function removeExternalLinkItem(index: number) {
    setProfileData((prev) => {
      const copy = [...(prev.external_links as ExternalLinkEntry[] || [])];
      copy.splice(index, 1);
      return { ...prev, external_links: copy };
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

    const validation = validateUserProfile({
      name: profileData.name || "",
      contact_number: profileData.contact_number || "",
      specialization: profileData.specialization || "",
      previous_experience: profileData.previous_experience || [],
    });

    if (!validation.isValid) {
      setProfileErrors(validation.errors);
      setError("Please fix the validation errors before saving.");
      setSaving(false);
      return;
    }
    setProfileErrors({});

    const payload = {
      name: profileData.name,
      contact_number: (profileData.contact_number || "").replace(/\D/g, ""),
      specialization: profileData.specialization,
      awards: profileData.awards.filter(Boolean),
      honorary_degrees: profileData.honorary_degrees.filter(Boolean),
      books_authored: (profileData.books_authored as BookAuthoredEntry[] || []).filter((book) => book && book.title?.trim()),
      other_accolades: profileData.other_accolades.filter(Boolean),
      previous_experience: profileData.previous_experience.filter((entry) =>
        entry.company || entry.role || entry.duration || entry.description
      ),
      external_links: (profileData.external_links as ExternalLinkEntry[] || []).filter((link) => link && link.title?.trim() && link.url?.trim()),
      publications: (profileData.publications || []).filter(Boolean),
      research: (profileData.research || []).filter(Boolean),
    };

    const response = await updateUserProfile(payload);
    if (!response.success) {
      setError(response.error || "Unable to save profile data.");
      setSaving(false);
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      awards: payload.awards,
      honorary_degrees: payload.honorary_degrees,
      books_authored: payload.books_authored,
      other_accolades: payload.other_accolades,
      previous_experience: payload.previous_experience,
      external_links: payload.external_links,
      publications: payload.publications,
      research: payload.research,
    }));

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
          <div className="flex-1 min-w-0 w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-blue-100 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name || ""}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Enter your name"
                  />
                  {profileErrors.name && (
                    <p className="text-xs text-red-200 font-bold mt-1.5">{profileErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-blue-100 mb-1.5">Specialization</label>
                  <input
                    type="text"
                    value={profileData.specialization || ""}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, specialization: e.target.value }))}
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Enter specialization"
                  />
                  {profileErrors.specialization && (
                    <p className="text-xs text-red-200 font-bold mt-1.5">{profileErrors.specialization}</p>
                  )}
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
          <button
            onClick={() => {
              setIsEditing((prev) => !prev);
              setProfileErrors({});
            }}
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
                  <>
                    {saving ? (
                      <div className="flex justify-center items-center py-2 px-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
                      >
                        <Check className="w-4 h-4" />
                        Save Updates
                      </button>
                    )}
                  </>
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
                        <div key={`exp-${index}`} className="rounded-3xl border border-gray-200 bg-white p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 flex-1">
                              <FieldInput
                                label="Company"
                                value={experience.company}
                                disabled={!isEditing}
                                onChange={(value) => updateExperience(index, "company", value)}
                                error={profileErrors.experience?.[index]?.company}
                              />
                              <FieldInput
                                label="Role"
                                value={experience.role}
                                disabled={!isEditing}
                                onChange={(value) => updateExperience(index, "role", value)}
                                error={profileErrors.experience?.[index]?.role}
                              />
                              <FieldInput
                                label="Duration"
                                value={experience.duration}
                                disabled={!isEditing}
                                onChange={(value) => updateExperience(index, "duration", value)}
                                error={profileErrors.experience?.[index]?.duration}
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

                <ProfileBooksSection
                  items={profileData.books_authored as BookAuthoredEntry[] || []}
                  isEditing={isEditing}
                  onChange={updateBookItem}
                  onAdd={addBookItem}
                  onRemove={removeBookItem}
                />

                <ProfileListSection
                  title="Publications"
                  icon={<FileText className="w-5 h-5 text-indigo-600" />}
                  items={profileData.publications || []}
                  isEditing={isEditing}
                  emptyLabel="No publications added yet"
                  onChange={(index, value) => updateArrayItem("publications", index, value)}
                  onAdd={() => addArrayItem("publications")}
                  onRemove={(index) => removeArrayItem("publications", index)}
                />

                <ProfileListSection
                  title="Research Area"
                  icon={<Sparkles className="w-5 h-5 text-teal-600" />}
                  items={profileData.research || []}
                  isEditing={isEditing}
                  emptyLabel="No research areas added yet"
                  onChange={(index, value) => updateArrayItem("research", index, value)}
                  onAdd={() => addArrayItem("research")}
                  onRemove={(index) => removeArrayItem("research", index)}
                />

                <ProfileExternalLinksSection
                  items={profileData.external_links as ExternalLinkEntry[] || []}
                  isEditing={isEditing}
                  onChange={updateExternalLinkItem}
                  onAdd={addExternalLinkItem}
                  onRemove={removeExternalLinkItem}
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
                {isEditing ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Phone</label>
                    <input
                      type="text"
                      value={profileData.contact_number || ""}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, contact_number: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter phone number"
                    />
                    {profileErrors.contact_number && (
                      <p className="text-xs text-red-500 font-bold mt-1.5">{profileErrors.contact_number}</p>
                    )}
                  </div>
                ) : (
                  <DetailRow icon={<Phone className="w-5 h-5 text-gray-400" />} label="Phone" value={profileData.contact_number || "Not added"} />
                )}
                {isEditing ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Specialization</label>
                    <input
                      type="text"
                      value={profileData.specialization || ""}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, specialization: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter specialization"
                    />
                    {profileErrors.specialization && (
                      <p className="text-xs text-red-500 font-bold mt-1.5">{profileErrors.specialization}</p>
                    )}
                  </div>
                ) : (
                  <DetailRow icon={<Briefcase className="w-5 h-5 text-gray-400" />} label="Specialization" value={profileData.specialization || "Not added"} />
                )}
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
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingJobId(job.id);
                              setEditingAchievementId(null);
                              setProfileJobErrors({});
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
                            className="flex items-center justify-center rounded-2xl border border-blue-300 bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                            aria-label="Edit job posting"
                            title="Edit job posting"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                show: true,
                                type: "job",
                                id: job.id,
                                title: `${job.role} at ${job.company}`,
                              });
                            }}
                            className="flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 p-2 text-red-700 hover:bg-red-100"
                            aria-label="Delete job posting"
                            title="Delete job posting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {editingJobId === job.id ? (
                        <div className="mt-5 grid gap-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FieldInput
                              label="Company / Hospital"
                              value={jobDraft.company || ""}
                              disabled={false}
                              onChange={(value) => setJobDraft((prev) => ({ ...prev, company: value }))}
                              placeholder="Enter company or hospital name"
                              error={profileJobErrors.company}
                            />
                            <FieldInput
                              label="Role / Specialization"
                              value={jobDraft.role || ""}
                              disabled={false}
                              onChange={(value) => setJobDraft((prev) => ({ ...prev, role: value }))}
                              placeholder="Enter job title or specialization"
                              error={profileJobErrors.role}
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FieldInput
                              label="Location"
                              value={jobDraft.location || ""}
                              disabled={false}
                              onChange={(value) => setJobDraft((prev) => ({ ...prev, location: value }))}
                              placeholder="Enter location"
                              error={profileJobErrors.location}
                            />
                            <div>
                              <label className="block text-sm font-medium text-slate-500 mb-2">Job type</label>
                              <select
                                value={jobDraft.job_type || ""}
                                onChange={(e) => setJobDraft((prev) => ({ ...prev, job_type: e.target.value }))}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FieldInput
                              label="Salary (LPA)"
                              value={jobDraft.salary || ""}
                              disabled={false}
                              onChange={(value) => setJobDraft((prev) => ({ ...prev, salary: value }))}
                              placeholder="Enter salary (e.g., 10 or 12.5)"
                              error={profileJobErrors.salary}
                            />
                            <FieldInput
                              label="Apply link"
                              value={jobDraft.apply_link || ""}
                              disabled={false}
                              onChange={(value) => setJobDraft((prev) => ({ ...prev, apply_link: value }))}
                              placeholder="Enter application link (optional)"
                              error={profileJobErrors.applyLink}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Description</label>
                            <textarea
                              value={jobDraft.description || ""}
                              onChange={(event) => setJobDraft((prev) => ({ ...prev, description: event.target.value }))}
                              placeholder="Enter job description"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            {profileJobErrors.description && <p className="text-xs text-red-500 mt-1">{profileJobErrors.description}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Requirements</label>
                            <textarea
                              value={jobDraft.requirements || ""}
                              onChange={(event) => setJobDraft((prev) => ({ ...prev, requirements: event.target.value }))}
                              placeholder="Enter requirements & qualifications"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {savingJobId === job.id ? (
                              <div className="flex justify-center items-center py-2 px-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const validation = validateJobPost({
                                      company: jobDraft.company || "",
                                      role: jobDraft.role || "",
                                      location: jobDraft.location || "",
                                      salary: jobDraft.salary || "",
                                      description: jobDraft.description || "",
                                      applyLink: jobDraft.apply_link || "",
                                    });
                                    if (!validation.isValid) {
                                      setProfileJobErrors(validation.errors);
                                      return;
                                    }
                                    setProfileJobErrors({});

                                    setSavingJobId(job.id);
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
                                    setSavingJobId(null);
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
                              </>
                            )}
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
                        <div className="flex gap-2">
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
                            className="flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                            aria-label="Edit achievement"
                            title="Edit achievement"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                show: true,
                                type: "achievement",
                                id: achievement.id,
                                title: achievement.title,
                              });
                            }}
                            className="flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 p-2 text-red-700 hover:bg-red-100"
                            aria-label="Delete achievement"
                            title="Delete achievement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                            {savingAchievementId === achievement.id ? (
                              <div className="flex justify-center items-center py-2 px-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setSavingAchievementId(achievement.id);
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
                                    setSavingAchievementId(null);
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
                              </>
                            )}
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

      {deleteConfirm && deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all scale-100 animate-scale-in">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <div className="p-3 bg-red-50 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Confirmation</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete the {deleteConfirm.type === "job" ? "job posting" : "achievement"}{" "}
              <strong className="text-gray-900">"{deleteConfirm.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmSubmit}
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
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
  placeholder,
  error,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-500 mb-2">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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

function ProfileBooksSection({
  items,
  isEditing,
  onChange,
  onAdd,
  onRemove,
}: {
  items: BookAuthoredEntry[];
  isEditing: boolean;
  onChange: (index: number, field: keyof BookAuthoredEntry, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Books Authored
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No books added yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`book-${index}`} className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2 items-center flex-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => onChange(index, "title", e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none"
                    placeholder="Book Title"
                  />
                  <input
                    type="text"
                    value={item.link || ""}
                    onChange={(e) => onChange(index, "link", e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none"
                    placeholder="Link (Optional)"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-700">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">
                      {item.title}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    item.title
                  )}
                </p>
              )}
              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileExternalLinksSection({
  items,
  isEditing,
  onChange,
  onAdd,
  onRemove,
}: {
  items: ExternalLinkEntry[];
  isEditing: boolean;
  onChange: (index: number, field: keyof ExternalLinkEntry, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
          <Globe className="w-5 h-5 text-blue-600" />
          External Links
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No links added yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`link-${index}`} className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2 items-center flex-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => onChange(index, "title", e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none"
                    placeholder="Link Title (e.g. LinkedIn)"
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => onChange(index, "url", e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none"
                    placeholder="URL (https://...)"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-700">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">
                    {item.title}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
              )}
              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
