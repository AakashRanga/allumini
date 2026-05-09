import { useState } from "react";
import { Mail, Calendar, Search, BookOpen, Download, Eye, X, ChevronDown, Filter } from "lucide-react";

interface Newsletter {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  thumbnail: string;
  content: string;
  author: string;
  readTime: string;
}

const newsletters: Newsletter[] = [
  {
    id: 1,
    title: "Alumni Success Stories - Q1 2026",
    description: "Celebrating outstanding achievements of our alumni community including promotions, research breakthroughs, and entrepreneurial ventures.",
    date: "2026-04-01",
    category: "Success Stories",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    content: `Dear Alumni Family,

We are absolutely thrilled to share the remarkable achievements of our distinguished alumni this quarter. Your success stories continue to inspire current students and fellow graduates alike.

Dr. Sarah Chen - Chief of Periodontics, Apollo Hospitals
After completing her MDS in Periodontics from our institution in 2018, Dr. Sarah Chen has been appointed as the Chief of Periodontics at Apollo Hospitals, Chennai. Her pioneering work in regenerative periodontal therapy has transformed patient outcomes and set new standards in the field. "The foundation I received at our college gave me the confidence to pursue excellence," shares Dr. Chen. She continues to mentor young periodontists and has published over 25 research papers in international journals.

Dr. Rajesh Kumar - Rural Healthcare Pioneer
Dr. Rajesh Kumar (BDS 2015) has successfully opened his third dental clinic in rural Maharashtra, bringing world-class dental care to underserved communities. His mission-driven approach combines affordable treatment with patient education, impacting over 10,000 rural families. "Access to quality dental care shouldn't be a luxury," says Dr. Kumar. His innovative mobile dental unit has become a model for rural healthcare delivery across the state.

Dr. Ananya Reddy - International Recognition
Our alumna Dr. Ananya Reddy (MDS Orthodontics, 2017) received the prestigious Young Orthodontist Award at the International Dental Congress in Singapore. Her research on clear aligner therapy for complex malocclusions has gained international acclaim. She now heads the Orthodontics Department at a leading private dental college in Bangalore.

Dr. MohammedFarooq - Entrepreneurial Excellence
Dr. Mohammed Farooq (BDS 2016) launched DentalTech Solutions, a healthcare technology startup that develops AI-powered diagnostic tools for dental practices. His company recently secured Series A funding of $2 million and is now operating in 5 countries. "Technology and dentistry together can revolutionize patient care," he explains.

These success stories remind us that our alumni community is making a real difference in healthcare, research, education, and entrepreneurship. We are incredibly proud of each achievement, big or small, as together we uphold the legacy of excellence our institution stands for.

We encourage all alumni to share their success stories with us. Your journey can inspire the next generation of dental and medical professionals.`,
    author: "Alumni Relations Team",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Medical Research Highlights - March 2026",
    description: "Latest research publications, clinical trials, and innovations by our alumni in the medical and dental fields.",
    date: "2026-03-15",
    category: "Research",
    thumbnail: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&h=600&fit=crop",
    content: `Research Excellence: Alumni Leading Medical Innovation

Our alumni continue to push the boundaries of medical research, contributing significantly to advancing healthcare knowledge and patient care. This month, we highlight groundbreaking research and clinical innovations from our distinguished researchers.

Dr. Priya Sharma - Minimally Invasive Surgery Breakthrough
Dr. Priya Sharma's (MS General Surgery, 2019) groundbreaking study on minimally invasive surgical techniques for complex abdominal procedures has been published in the Journal of Medical Sciences with an impact factor of 8.5. Her research demonstrates a 40% reduction in post-operative complications and significantly faster recovery times. The study has been cited by over 50 international researchers and is being implemented in teaching hospitals across India.

"Our research focused on developing patient-centric surgical approaches that minimize trauma while maximizing outcomes," explains Dr. Sharma, who is currently a Senior Consultant at AIIMS, New Delhi. Her work has won the Best Research Paper Award at the National Surgical Conference.

Dr. Michael D'Souza - Dental Implant Innovation
Dr. Michael D'Souza (MDS Prosthodontics, 2018) received a prestigious research grant of ₹50 lakhs from the Indian Council of Medical Research (ICMR) for his innovative work on bioactive dental implants. His research explores novel surface modifications that enhance osseointegration and reduce implant failure rates.

His preliminary clinical trials show a 95% success rate over 5 years, significantly higher than conventional implants. "We're creating the next generation of dental implants that work in harmony with the body's natural healing processes," says Dr. D'Souza.

Dr. Lakshmi Narayan - Cancer Research Advancement
Dr. Lakshmi Narayan (PHD Biochemistry, 2020) published her research on oral cancer biomarkers in the prestigious Nature Medicine journal. Her work identifies specific genetic markers that enable early detection of oral squamous cell carcinoma, potentially saving thousands of lives through early intervention.

Her research team at the Cancer Research Institute has developed a non-invasive screening test that is now in Phase III clinical trials. "Early detection is the key to improving survival rates in oral cancer," she emphasizes.

Dr. Amit Verma - Pediatric Dentistry Research
Dr. Amit Verma (MDS Pedodontics, 2017) completed a landmark longitudinal study tracking dental health outcomes in 2,000 children over 5 years. His research on preventive strategies has influenced national school dental health programs and received funding from WHO for expansion to other developing nations.

Clinical Trials Update
Several of our alumni are leading multi-center clinical trials:
- Novel antibiotic regimens for periodontal disease (Dr. Kavita Menon)
- Pain management protocols in endodontics (Dr. Suresh Pillai)
- Regenerative techniques in periodontal therapy (Dr. Deepa Krishnan)

Publications This Quarter:
Our alumni have collectively published 47 research papers in peer-reviewed journals, presented at 23 international conferences, and filed 5 patents for medical innovations.

We congratulate all our researcher alumni for their dedication to advancing medical science and improving patient care worldwide.`,
    author: "Research Committee",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Community Outreach & Social Impact",
    description: "Dental camps, health awareness programs, and community service initiatives led by our alumni network.",
    date: "2026-03-01",
    category: "Community",
    thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
    content: `Making a Difference: Alumni Community Service Initiatives

Our alumni network continues to demonstrate exceptional commitment to social responsibility through various community outreach programs. This month, we celebrate the incredible impact our graduates are making in underserved communities.

Free Dental Camp Initiative - Transforming Smiles
Our alumni organized 12 comprehensive dental camps across Tamil Nadu, Karnataka, and Maharashtra, providing free dental treatment to over 3,000 underprivileged patients. These camps offered services including:
- Dental check-ups and oral health screening
- Free tooth extractions and fillings
- Dentures for elderly patients
- Fluoride treatments for children
- Oral hygiene education sessions

Dr. Aisha Patel (BDS 2016) spearheaded the "Smile for All" campaign, coordinating a team of 45 volunteer dentists to serve 50 rural villages. "Seeing the gratitude in patients' eyes when we relieve their pain makes all the effort worthwhile," she shares. Her team provided treatment worth over ₹25 lakhs completely free of charge.

Rural Health Awareness Campaign
Dr. Ramesh Babu's (MDS Public Health Dentistry, 2017) innovative health awareness program reached 15,000 villagers through interactive sessions, street plays, and community workshops. The program focused on:
- Preventive dental care practices
- Tobacco cessation counseling
- Nutritional guidance for oral health
- Early detection of oral cancer
- Maternal and child dental health

His "Mobile Dental Van" initiative brings dental care directly to remote villages, eliminating the barrier of travel for rural populations. The program has screened 8,500 patients and identified 340 cases requiring immediate intervention.

School Dental Health Program
Dr. Meena Iyer (BDS 2018) launched the "Bright Smiles" program in 75 government schools, conducting oral health screenings for 12,000 children. The program includes:
- Free dental check-ups
- Fluoride varnish application
- Pit and fissure sealants
- Oral hygiene education
- Distribution of dental care kits

"Childhood is the best time to instill good oral hygiene habits," explains Dr. Iyer. Her program has reduced dental caries incidence by 35% in participating schools.

Cleft Lip and Palate Mission
Dr. Vikram Singh (MDS Oral & Maxillofacial Surgery, 2015) performed 28 free cleft surgeries this quarter through the "Smile Foundation" initiative. Working with a team of volunteer surgeons, anesthesiologists, and nurses, he's transformed the lives of children born with facial deformities.

"Every child deserves a smile without stigma," says Dr. Singh, who has performed over 200 free cleft surgeries in his career. The foundation also provides speech therapy and long-term follow-up care.

Elderly Care Initiative
Dr. Sunita Rao's (BDS 2014) "Golden Years Dental Care" program provides free dental services to elderly residents in 8 old-age homes across Bangalore. Over 400 senior citizens have received dentures, dental treatment, and regular oral health maintenance.

Disaster Relief Efforts
When floods devastated parts of Kerala, our alumni immediately mobilized to provide emergency dental care. Dr. Jose Thomas (BDS 2019) led a team that set up temporary dental clinics in relief camps, treating over 500 displaced persons for dental emergencies and infections.

Corporate Social Responsibility
Many of our alumni who run successful private practices have pledged to treat one underprivileged patient free every day. This collective commitment translates to over 15,000 free treatments annually.

Medical Missions
Dr. Karthik Reddy (MS General Surgery, 2016) participated in a medical mission to rural Nepal, performing 45 surgeries and training local healthcare workers in modern surgical techniques.

Impact by Numbers:
- 3,000+ patients treated in dental camps
- 50 villages reached
- 12,000 school children screened
- 28 cleft surgeries performed
- 400 elderly patients served
- ₹25+ lakhs worth of free treatment provided

These initiatives exemplify the values of compassion, service, and social responsibility that our institution instills. We are immensely proud of our alumni who are using their skills and expertise to create meaningful social impact.

We encourage all alumni to participate in community service initiatives. Together, we can make healthcare accessible to all, regardless of their economic background.`,
    author: "Community Outreach Team",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Career & Professional Development",
    description: "Career advancement tips, continuing education opportunities, and professional networking insights for medical professionals.",
    date: "2026-02-15",
    category: "Career",
    thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
    content: `Your Career Compass: Professional Growth in Healthcare

The healthcare landscape is constantly evolving, and staying ahead requires continuous learning and strategic career planning. This edition provides valuable insights, opportunities, and guidance for advancing your medical or dental career.

Fellowship Programs Abroad - Your Gateway to Global Expertise

Dr. Neha Kapoor (MDS Orthodontics, 2020) shares her experience pursuing a fellowship at the University of Toronto: "International exposure transformed my clinical perspective. The advanced training, cutting-edge technology, and diverse patient demographics enriched my skills tremendously."

Top Fellowship Opportunities for 2026:
- Harvard School of Dental Medicine - Advanced Implantology
- Mayo Clinic - Oral & Maxillofacial Surgery Fellowship
- King's College London - Restorative Dentistry
- University of Melbourne - Pediatric Dentistry
- Columbia University - Periodontal-Prosthodontic Combined Program

Application Timeline: Most programs have deadlines between August-December for the following year. Start preparing your CV, research portfolio, and recommendation letters 12-18 months in advance.

Building a Successful Private Practice

Dr. Arjun Mehta (BDS 2015), who built a thriving multi-specialty dental clinic in Pune, shares his insights:

"Success in private practice requires more than clinical excellence. You need business acumen, patient relationship management, and a clear brand identity."

Key Success Factors:
1. Location Selection: Conduct thorough demographic research. Consider accessibility, parking, and visibility.

2. Financial Planning: Budget for at least 6-12 months of operating expenses before expecting profitability. Dr. Mehta recommends maintaining a reserve fund covering 3 months of expenses.

3. Technology Investment: Modern equipment isn't just about efficiency—it's about patient confidence. Digital X-rays, intraoral cameras, and practice management software are essential.

4. Team Building: "Your staff represents your practice. Invest in their training and create a positive work environment," advises Dr. Mehta.

5. Marketing Strategy: Build an online presence through a professional website, active social media, and Google My Business. Patient testimonials and before-after cases build credibility.

6. Patient Experience: From appointment scheduling to follow-up care, every touchpoint matters. Dr. Mehta's clinic has a 92% patient retention rate due to exceptional service.

Continuing Education Opportunities

The Indian Dental Association and Medical Council of India mandate continuous professional development. Here are upcoming opportunities:

Courses & Workshops:
- Advanced Endodontic Techniques - IDA Conference, Mumbai (June 2026)
- Aesthetic Dentistry Masterclass - Bangalore (July 2026)
- Implant Surgery Hands-on Workshop - Delhi (August 2026)
- Practice Management for Dentists - Online (May 2026)
- Medical Laser Applications - Chennai (September 2026)

Online Learning Platforms:
- Coursera: Healthcare Management Specializations
- edX: Harvard Medical School Programs
- ADA CE Online: Continuing Education Credits
- Spear Education: Comprehensive Dental CE

Hospital vs. Private Practice: Making the Choice

Dr. Sanjay Kumar (MS General Surgery, 2018) works at a premier corporate hospital, while Dr. Pooja Nair (BDS 2018) runs her own clinic. Both share their perspectives:

Hospital Practice (Dr. Kumar):
"Working in a hospital environment provides exposure to complex cases, peer learning, advanced infrastructure, and financial stability. You focus purely on clinical work without administrative burdens."

Pros: Regular income, team support, continuing education, diverse cases
Cons: Fixed working hours, limited autonomy, administrative bureaucracy

Private Practice (Dr. Nair):
"Independence and control over your practice are incredibly fulfilling. You build lasting patient relationships and have the freedom to implement your vision."

Pros: Higher income potential, flexibility, autonomy, brand building
Cons: Business responsibilities, initial investment, irregular income initially

Specialist vs. General Practice

The dental field offers numerous specialization pathways. Consider:
- Your passion and clinical interests
- Market demand in your area
- Additional education requirements
- Income potential and competition
- Work-life balance preferences

Career Transition Stories

Dr. Rohit Desai (BDS 2012) transitioned from clinical practice to healthcare administration, now serving as Hospital Administrator at a 300-bed multi-specialty hospital. "My clinical background gives me unique insights into hospital operations. Don't be afraid to explore non-clinical healthcare careers."

Alternative Career Paths:
- Healthcare Consulting
- Medical Writing & Research
- Dental Product Sales & Marketing
- Healthcare IT & Technology
- Public Health Administration
- Medical Education & Academics
- Healthcare Policy & Advocacy

Networking for Success

Professional networking opens doors to opportunities, collaborations, and knowledge sharing. Join:
- Indian Dental Association (IDA)
- State Dental Council
- Specialty-specific associations
- Alumni networks (SACRED Alumni Connect)
- Online professional communities

Dr. Kavita Sharma (MDS Periodontics, 2017) found her current hospital position through an alumni connection: "Never underestimate the power of professional relationships."

Financial Planning for Medical Professionals

CA Madhav Krishnan, financial advisor specializing in healthcare professionals, recommends:
- Start retirement planning early (ideally in your 30s)
- Maintain professional indemnity insurance
- Diversify income streams (consultations, workshops, online courses)
- Build an emergency fund covering 12 months of expenses
- Consider tax-saving investments aligned with your goals

Work-Life Balance

Dr. Priya Menon (BDS 2016) shares: "Burnout is real in healthcare. Set boundaries, delegate when possible, and prioritize self-care. A healthy doctor provides better patient care."

Mental Health Resources:
Our alumni network has partnered with mental health professionals to offer confidential counseling services. Contact the Alumni Relations Office for details.

Upcoming Career Events:
- Career Development Workshop - Virtual (April 15, 2026)
- Practice Management Seminar - Bangalore (May 20, 2026)
- Alumni Networking Meetup - Mumbai (June 10, 2026)

Your career journey is unique. Whether you're just starting out or considering a change, remember that our alumni community is here to support you. Reach out, connect, and grow together.`,
    author: "Career Services",
    readTime: "8 min read",
  },
];

const categories = ["All", "Success Stories", "Research", "Community", "Career"];

export default function Newsletter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesCategory = selectedCategory === "All" || newsletter.category === selectedCategory;
    const matchesSearch =
      newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search newsletters..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredNewsletters.map((newsletter) => (
          <div
            key={newsletter.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={newsletter.thumbnail}
                alt={newsletter.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg text-sm font-semibold shadow-lg">
                  {newsletter.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(newsletter.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {newsletter.readTime}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {newsletter.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                {newsletter.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">By {newsletter.author}</span>
                <button
                  onClick={() => setSelectedNewsletter(newsletter)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNewsletters.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Newsletters Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Newsletter Modal */}
      {selectedNewsletter && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setSelectedNewsletter(null)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-slideUp flex flex-col">
              {/* Modal Header */}
              <div className="relative h-64 flex-shrink-0 overflow-hidden">
                <img
                  src={selectedNewsletter.thumbnail}
                  alt={selectedNewsletter.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={() => setSelectedNewsletter(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg text-sm font-semibold inline-block mb-3">
                    {selectedNewsletter.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedNewsletter.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-white/90">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedNewsletter.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{selectedNewsletter.readTime}</span>
                    <span>•</span>
                    <span>By {selectedNewsletter.author}</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 min-h-0">
                <p className="text-lg text-gray-700 leading-relaxed mb-6 font-medium">
                  {selectedNewsletter.description}
                </p>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {selectedNewsletter.content}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedNewsletter(null)}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
