import { useState, useRef } from 'react';
import {
  User, MapPin, Briefcase, GraduationCap,
  Github, Linkedin, Plus, X, Tag,
  ChevronRight, ChevronLeft, Save
} from 'lucide-react';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

// Education Add Modal (inner modal)
function AddEducationModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    degree: '', institution: '', board: '',
    start_year: '', end_year: '', percentage: '',
    is_current: false
  });

  const handleSubmit = () => {
    if (!form.degree || !form.institution) {
      toast.error('Degree and institution are required');
      return;
    }
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center
      justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] rounded-2xl
        shadow-2xl w-full max-w-md p-6
        border border-[var(--color-border)]">

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-sora font-bold text-lg
            text-[var(--color-text-primary)]">
            Add Education
          </h3>
          <button onClick={onClose}
            className="p-1.5 rounded-lg
              text-[var(--color-text-muted)]
              hover:bg-[var(--color-surface-2)]">
            <X size={18}/>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold
              uppercase tracking-wide
              text-[var(--color-text-muted)] mb-1">
              Degree / Course *
            </label>
            <input type="text" value={form.degree}
              onChange={e => setForm({...form, degree: e.target.value})}
              placeholder="e.g. B.Tech, MBA IT, Senior Secondary"
              className="w-full px-3 py-2.5 rounded-lg border
                border-[var(--color-border)]
                bg-[var(--color-surface-2)]
                text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:ring-2
                focus:ring-[var(--color-primary)] text-sm"/>
          </div>

          <div>
            <label className="block text-xs font-semibold
              uppercase tracking-wide
              text-[var(--color-text-muted)] mb-1">
              Institution / School *
            </label>
            <input type="text" value={form.institution}
              onChange={e => setForm({...form, institution: e.target.value})}
              placeholder="e.g. MIT College Nanded"
              className="w-full px-3 py-2.5 rounded-lg border
                border-[var(--color-border)]
                bg-[var(--color-surface-2)]
                text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:ring-2
                focus:ring-[var(--color-primary)] text-sm"/>
          </div>

          <div>
            <label className="block text-xs font-semibold
              uppercase tracking-wide
              text-[var(--color-text-muted)] mb-1">
              Board / University
            </label>
            <input type="text" value={form.board}
              onChange={e => setForm({...form, board: e.target.value})}
              placeholder="e.g. Maharashtra State Board, SPPU"
              className="w-full px-3 py-2.5 rounded-lg border
                border-[var(--color-border)]
                bg-[var(--color-surface-2)]
                text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:ring-2
                focus:ring-[var(--color-primary)] text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold
                uppercase tracking-wide
                text-[var(--color-text-muted)] mb-1">
                Start Year
              </label>
              <input type="number" value={form.start_year}
                onChange={e => setForm({
                  ...form, start_year: e.target.value
                })}
                placeholder="2021"
                min="1990" max="2030"
                className="w-full px-3 py-2.5 rounded-lg border
                  border-[var(--color-border)]
                  bg-[var(--color-surface-2)]
                  text-[var(--color-text-primary)]
                  focus:outline-none focus:ring-2
                  focus:ring-[var(--color-primary)] text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-semibold
                uppercase tracking-wide
                text-[var(--color-text-muted)] mb-1">
                End Year
              </label>
              <input type="number" value={form.end_year}
                onChange={e => setForm({
                  ...form, end_year: e.target.value
                })}
                placeholder="2025"
                min="1990" max="2035"
                disabled={form.is_current}
                className="w-full px-3 py-2.5 rounded-lg border
                  border-[var(--color-border)]
                  bg-[var(--color-surface-2)]
                  text-[var(--color-text-primary)]
                  focus:outline-none focus:ring-2
                  focus:ring-[var(--color-primary)] text-sm
                  disabled:opacity-50"/>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_current"
              checked={form.is_current}
              onChange={e => setForm({
                ...form, is_current: e.target.checked,
                end_year: e.target.checked ? '' : form.end_year
              })}
              className="w-4 h-4 accent-[var(--color-primary)]"/>
            <label htmlFor="is_current"
              className="text-sm text-[var(--color-text-secondary)]">
              Currently studying here
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold
              uppercase tracking-wide
              text-[var(--color-text-muted)] mb-1">
              Percentage / CGPA
            </label>
            <input type="text" value={form.percentage}
              onChange={e => setForm({...form, percentage: e.target.value})}
              placeholder="e.g. 75.52% or 8.5 CGPA"
              className="w-full px-3 py-2.5 rounded-lg border
                border-[var(--color-border)]
                bg-[var(--color-surface-2)]
                text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:ring-2
                focus:ring-[var(--color-primary)] text-sm"/>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border
              border-[var(--color-border)] text-sm font-medium
              text-[var(--color-text-secondary)]
              hover:bg-[var(--color-surface-2)]">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm
              font-semibold text-white
              bg-[var(--color-primary)]
              hover:bg-[var(--color-primary-light)]">
            Add Education
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Profile Completion Modal
export default function ProfileCompletionModal({ onClose }) {
  const { user } = useSelector(s => s.auth);
  const [saving, setSaving] = useState(false);
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    professional_title: '',
    location: '',
    career_objective: '',
    skills_list: [],
    github_url: '',
    linkedin_url: '',
  });

  const [educations, setEducations] = useState([]);

  if (!user) return null;

  // Skill tag add
  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const skill = skillInput.trim();
      if (!form.skills_list.includes(skill)) {
        setForm(prev => ({
          ...prev,
          skills_list: [...prev.skills_list, skill]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills_list: prev.skills_list.filter(s => s !== skill)
    }));
  };

  const addEducation = async (edu) => {
    try {
      const res = await axiosInstance.post('/users/me/education', edu);
      setEducations(prev => [...prev, res.data.data]);
      toast.success('Education added');
    } catch {
      // Add locally even if API fails
      setEducations(prev => [...prev, { ...edu, id: Date.now().toString() }]);
    }
  };

  const removeEducation = async (id) => {
    try {
      await axiosInstance.delete(`/users/me/education/${id}`);
    } catch {}
    setEducations(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name) {
      toast.error('First name and last name are required');
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.put('/users/me', form);
      localStorage.setItem(`profile_done_${user?.id}`, '1');
      toast.success('Profile saved! Welcome 🎉');
      onClose();
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(`profile_done_${user?.id}`, '1');
    onClose();
  };

  return (
    <>
      {showAddEdu && (
        <AddEducationModal
          onAdd={addEducation}
          onClose={() => setShowAddEdu(false)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center
        justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-[var(--color-surface)] rounded-2xl
          shadow-2xl w-full max-w-2xl max-h-[92vh]
          overflow-hidden flex flex-col
          border border-[var(--color-border)]">

          {/* HEADER */}
          <div className="flex items-center justify-between
            px-6 py-4 border-b border-[var(--color-border)]
            bg-gradient-to-r from-[#1E3A5F] to-[#2E5490]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl
                bg-white/10 flex items-center justify-center">
                <User size={20} className="text-white"/>
              </div>
              <div>
                <h2 className="font-sora font-bold text-white text-lg">
                  Complete Your Profile
                </h2>
                <p className="text-white/60 text-xs mt-0.5">
                  Help others know you better
                </p>
              </div>
            </div>
            <button onClick={handleSkip}
              className="text-white/60 hover:text-white
                text-xs hover:underline transition-colors">
              Skip for now
            </button>
          </div>

          {/* SCROLLABLE FORM BODY */}
          <div className="overflow-y-auto flex-1 px-6 py-5
            space-y-6">

            {/* ── PERSONAL INFO ── */}
            <section>
              <p className="text-xs font-semibold uppercase
                tracking-widest text-[var(--color-text-muted)]
                mb-3 flex items-center gap-2">
                <User size={13}/> Personal Information
              </p>

              {/* First + Last name */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold
                    uppercase tracking-wide
                    text-[var(--color-text-muted)] mb-1">
                    First Name *
                  </label>
                  <input type="text" value={form.first_name}
                    onChange={e => setForm({
                      ...form, first_name: e.target.value
                    })}
                    placeholder="Gous"
                    className="w-full px-3 py-2.5 rounded-lg border
                      border-[var(--color-border)]
                      bg-[var(--color-surface-2)]
                      text-[var(--color-text-primary)]
                      placeholder:text-[var(--color-text-muted)]
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-primary)] text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold
                    uppercase tracking-wide
                    text-[var(--color-text-muted)] mb-1">
                    Last Name *
                  </label>
                  <input type="text" value={form.last_name}
                    onChange={e => setForm({
                      ...form, last_name: e.target.value
                    })}
                    placeholder="Khan"
                    className="w-full px-3 py-2.5 rounded-lg border
                      border-[var(--color-border)]
                      bg-[var(--color-surface-2)]
                      text-[var(--color-text-primary)]
                      placeholder:text-[var(--color-text-muted)]
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-primary)] text-sm"/>
                </div>
              </div>

              {/* Gender */}
              <div className="mb-3">
                <label className="block text-xs font-semibold
                  uppercase tracking-wide
                  text-[var(--color-text-muted)] mb-1">
                  Gender
                </label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} type="button"
                      onClick={() => setForm({...form, gender: g})}
                      className={`flex-1 py-2.5 rounded-lg
                        border text-sm font-medium
                        transition-all duration-200
                        ${form.gender === g
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]'
                        }`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Professional Title + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold
                    uppercase tracking-wide
                    text-[var(--color-text-muted)] mb-1 flex
                    items-center gap-1">
                    <Briefcase size={11}/>
                    Professional Title
                  </label>
                  <input type="text"
                    value={form.professional_title}
                    onChange={e => setForm({
                      ...form, professional_title: e.target.value
                    })}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full px-3 py-2.5 rounded-lg border
                      border-[var(--color-border)]
                      bg-[var(--color-surface-2)]
                      text-[var(--color-text-primary)]
                      placeholder:text-[var(--color-text-muted)]
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-primary)] text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold
                    uppercase tracking-wide
                    text-[var(--color-text-muted)] mb-1 flex
                    items-center gap-1">
                    <MapPin size={11}/> Location
                  </label>
                  <input type="text" value={form.location}
                    onChange={e => setForm({
                      ...form, location: e.target.value
                    })}
                    placeholder="e.g. Mumbai, India"
                    className="w-full px-3 py-2.5 rounded-lg border
                      border-[var(--color-border)]
                      bg-[var(--color-surface-2)]
                      text-[var(--color-text-primary)]
                      placeholder:text-[var(--color-text-muted)]
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-primary)] text-sm"/>
                </div>
              </div>
            </section>

            {/* ── CAREER OBJECTIVE ── */}
            <section>
              <p className="text-xs font-semibold uppercase
                tracking-widest text-[var(--color-text-muted)]
                mb-3 flex items-center gap-2">
                <Briefcase size={13}/> Career Objective
              </p>
              <textarea rows={3}
                value={form.career_objective}
                onChange={e => setForm({
                  ...form, career_objective: e.target.value
                })}
                placeholder="To secure an entry-level position in the field of Software Development where I can apply my skills in programming, while continuously learning and contributing to the organization's growth."
                className="w-full px-3 py-2.5 rounded-lg border
                  border-[var(--color-border)]
                  bg-[var(--color-surface-2)]
                  text-[var(--color-text-primary)]
                  placeholder:text-[var(--color-text-muted)]
                  focus:outline-none focus:ring-2
                  focus:ring-[var(--color-primary)] text-sm
                  resize-none leading-relaxed"/>
              <p className="text-xs text-[var(--color-text-muted)]
                mt-1">
                Write 2-3 sentences about your career goals
              </p>
            </section>

            {/* ── EDUCATION ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase
                  tracking-widest text-[var(--color-text-muted)]
                  flex items-center gap-2">
                  <GraduationCap size={13}/> Education
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddEdu(true)}
                  className="flex items-center gap-1.5 text-xs
                    font-semibold text-[var(--color-primary)]
                    hover:text-[var(--color-primary-light)]
                    transition-colors">
                  <Plus size={14}/>
                  Add Education
                </button>
              </div>

              {/* Education list */}
              {educations.length === 0 ? (
                <div className="border-2 border-dashed
                  border-[var(--color-border)] rounded-xl
                  py-6 text-center">
                  <GraduationCap size={24}
                    className="mx-auto mb-2
                    text-[var(--color-text-muted)]"/>
                  <p className="text-sm
                    text-[var(--color-text-muted)]">
                    No education added yet
                  </p>
                  <button type="button"
                    onClick={() => setShowAddEdu(true)}
                    className="mt-2 text-xs font-semibold
                      text-[var(--color-primary)]
                      hover:underline">
                    + Add Education
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id}
                      className="flex items-start justify-between
                        bg-[var(--color-surface-2)] rounded-xl p-4
                        border border-[var(--color-border)]">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm
                          text-[var(--color-text-primary)]">
                          {edu.degree}
                        </p>
                        <p className="text-sm
                          text-[var(--color-text-secondary)] mt-0.5">
                          {edu.institution}
                        </p>
                        {edu.board && (
                          <p className="text-xs
                            text-[var(--color-text-muted)] mt-0.5">
                            {edu.board}
                          </p>
                        )}
                        <div className="flex items-center gap-3
                          mt-1">
                          {(edu.start_year || edu.end_year) && (
                            <p className="text-xs
                              text-[var(--color-text-muted)]">
                              {edu.start_year} — {edu.is_current ? 'Present' : edu.end_year}
                            </p>
                          )}
                          {edu.percentage && (
                            <p className="text-xs
                              text-[var(--color-text-muted)]">
                              {edu.percentage}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="p-1.5 rounded-lg ml-3 flex-shrink-0
                          text-[var(--color-text-muted)]
                          hover:text-[var(--color-danger)]
                          hover:bg-red-50 dark:hover:bg-red-900/20
                          transition-all">
                        <X size={14}/>
                      </button>
                    </div>
                  ))}

                  <button type="button"
                    onClick={() => setShowAddEdu(true)}
                    className="w-full py-2 rounded-xl border
                      border-dashed border-[var(--color-border)]
                      text-xs font-semibold
                      text-[var(--color-primary)]
                      hover:bg-[var(--color-surface-2)]
                      transition-all flex items-center
                      justify-center gap-1.5">
                    <Plus size={13}/> Add Another Education
                  </button>
                </div>
              )}
            </section>

            {/* ── SKILLS ── */}
            <section>
              <p className="text-xs font-semibold uppercase
                tracking-widest text-[var(--color-text-muted)]
                mb-3 flex items-center gap-2">
                <Tag size={13}/> Skills
                <span className="normal-case font-normal
                  text-[var(--color-text-muted)]">
                  (press Enter to add)
                </span>
              </p>

              {/* Skill tags display */}
              {form.skills_list.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.skills_list.map(skill => (
                    <span key={skill}
                      className="flex items-center gap-1.5
                        bg-[var(--color-primary)]/10
                        border border-[var(--color-primary)]/30
                        text-[var(--color-primary)]
                        px-3 py-1 rounded-full text-xs
                        font-medium">
                      {skill}
                      <button type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500
                          transition-colors ml-0.5">
                        <X size={10}/>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="e.g. React, Node.js, Python (Press Enter)"
                className="w-full px-3 py-2.5 rounded-lg border
                  border-[var(--color-border)]
                  bg-[var(--color-surface-2)]
                  text-[var(--color-text-primary)]
                  placeholder:text-[var(--color-text-muted)]
                  focus:outline-none focus:ring-2
                  focus:ring-[var(--color-primary)] text-sm"/>
            </section>

            {/* ── LINKS ── */}
            <section>
              <p className="text-xs font-semibold uppercase
                tracking-widest text-[var(--color-text-muted)]
                mb-3">
                Links
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold
                    uppercase tracking-wide
                    text-[var(--color-text-muted)] mb-1 flex
                    items-center gap-1">
                    <Github size={11}/> GitHub URL
                  </label>
                  <input type="url" value={form.github_url}
                    onChange={e => setForm({
                      ...form, github_url: e.target.value
                    })}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-3 py-2.5 rounded-lg border
                      border-[var(--color-border)]
                      bg-[var(--color-surface-2)]
                      text-[var(--color-text-primary)]
                      placeholder:text-[var(--color-text-muted)]
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-primary)] text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold
                    uppercase tracking-wide
                    text-[var(--color-text-muted)] mb-1 flex
                    items-center gap-1">
                    <Linkedin size={11}/> LinkedIn URL
                  </label>
                  <input type="url" value={form.linkedin_url}
                    onChange={e => setForm({
                      ...form, linkedin_url: e.target.value
                    })}
                    placeholder="https://linkedin.com/in/yourname"
                    className="w-full px-3 py-2.5 rounded-lg border
                      border-[var(--color-border)]
                      bg-[var(--color-surface-2)]
                      text-[var(--color-text-primary)]
                      placeholder:text-[var(--color-text-muted)]
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-primary)] text-sm"/>
                </div>
              </div>
            </section>

          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t
            border-[var(--color-border)]
            bg-[var(--color-surface-2)]
            flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              ✅ Takes only 2 minutes
            </p>
            <div className="flex gap-3">
              <button onClick={handleSkip}
                className="px-5 py-2.5 rounded-lg border
                  border-[var(--color-border)] text-sm font-medium
                  text-[var(--color-text-secondary)]
                  hover:bg-[var(--color-surface)]
                  transition-all">
                Skip for now
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-lg text-sm
                  font-semibold text-white
                  bg-[var(--color-primary)]
                  hover:bg-[var(--color-primary-light)]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all flex items-center gap-2">
                <Save size={15}/>
                {saving ? 'Saving...' : 'Save and Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
