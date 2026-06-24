function switchTab(tabId) {
      const contents = document.querySelectorAll('.tab-content');
      contents.forEach(content => content.style.display = 'none');
      const selectedContent = document.getElementById(`tab-${tabId}`);
      if (selectedContent) { selectedContent.style.display = 'block'; }
      const sidebarLinks = document.querySelectorAll('.sidebar-link');
      sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick').includes(tabId)) { link.classList.add('active'); }
      });
}
function getLocalData(key, defaultData = []) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultData;
}
function saveLocalData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
const defaultCandidates = [
  { id: 1, name: "Aziza Karimova", email: "aziza@mail.ru", phone: "+998 93 456 12 12", job: "English Department Head", skills: "IELTS 8.0, Curriculum Planning, 4 Years Exp", status: "pending", bio: "Highly interested in contributing to the academic development of Bir Ta'lim students." },
  { id: 2, name: "Sherzod Halimov", email: "sher@tech.uz", phone: "+998 90 789 34 34", job: "Senior React Developer", skills: "JavaScript, React, NextJS, Node.js, Webpack", status: "pending", bio: "Senior front-end engineer looking for advanced projects in Uzbekistan." }
  ];
const defaultOrders = [
  { id: 1, company: "LingoKids School", contact: "Saida Usmanova, Principal", email: "saida@lingokids.uz", role: "Primary ESL Teacher", salary: "8,000,000 UZS", desc: "Native-level fluency needed. Experience working with young children preferred." },
  { id: 2, name: "Sky IT Hub", contact: "Azim Ahmedov, Founder", email: "azim@skyit.uz", role: "Junior Node.js Developer", salary: "$1,000 / month", desc: "Willing to train passionate juniors who have solid knowledge in Express.js." }
  ];
if (!localStorage.getItem('cand_submissions')) { saveLocalData('cand_submissions', defaultCandidates); }
if (!localStorage.getItem('client_orders')) { saveLocalData('client_orders', defaultOrders); }
function quickApply(jobTitle, companyName) {
      alert(`Applying for "${jobTitle}" at ${companyName}. Redirecting you to the application form tab...`);
      switchTab('apply');
      const selectElem = document.getElementById('cand-job');
      if (selectElem) { selectElem.value = jobTitle; }
}
function submitCandidateCV(event) {
      event.preventDefault();
      const name = document.getElementById('cand-name').value;
      const email = document.getElementById('cand-email').value;
      const phone = document.getElementById('cand-phone').value;
      const job = document.getElementById('cand-job').value;
      const skills = document.getElementById('cand-skills').value;
      const bio = document.getElementById('cand-bio').value;
      const list = getLocalData('cand_submissions');
      const newCand = { id: Date.now(), name, email, phone, job, skills, bio, status: 'pending' };
      list.push(newCand);
      saveLocalData('cand_submissions', list);
      alert(`Awesome, ${name}! Your CV has been successfully registered with Bir Ta'lim Jobs. Our recruiters will review your files.`);
      event.target.reset();
      switchTab('jobs');
}
function submitStaffingRequest(event) {
      event.preventDefault();
      const company = document.getElementById('emp-company').value;
      const contact = document.getElementById('emp-contact').value;
      const email = document.getElementById('emp-email').value;
      const role = document.getElementById('emp-role').value;
      const salary = document.getElementById('emp-salary').value;
      const desc = document.getElementById('emp-desc').value;
      const list = getLocalData('client_orders');
      const newOrder = { id: Date.now(), company, contact, email, role, salary, desc };
      list.push(newOrder);
      saveLocalData('client_orders', list);
      alert(`Recruitment request received for "${role}".`);
      event.target.reset();
      switchTab('shortlists');
}
function renderRecruiterTables() {
      const candTable = document.getElementById('rec-candidates-table');
      const orderTable = document.getElementById('rec-orders-table');
      const shortlistTable = document.getElementById('rec-shortlists-table');
      if (candTable) {
                const candidates = getLocalData('cand_submissions');
                candTable.innerHTML = '';
                if (candidates.length === 0) {
                              candTable.innerHTML = '<tr><td colspan="6" style="text-align:center;">No candidates in queue.</td></tr>';
                } else {
                              candidates.forEach(cand => {
                                                const tr = document.createElement('tr');
                                                tr.innerHTML = `
                                                                    <td style="font-weight: 700;">${cand.name}</td>
                                                                                        <td>${cand.job}</td>
                                                                                                            <td><span style="font-size:0.8rem; background-color:#eaeaea; padding:2px 6px; border-radius:4px;">${cand.skills}</span></td>
                                                                                                                                <td>${cand.phone}<br><span style="color:var(--text-light); font-size:0.8rem;">${cand.email}</span></td>
                                                                                                                                                    <td><span class="badge badge-${cand.status}">${cand.status}</span></td>
                                                                                                                                                                        <td>
                                                                                                                                                                                                ${cand.status === 'pending' ? `
                                                                                                                                                                                                                            <button class="btn btn-success" style="padding:4px 8px;" onclick="updateCandidateStatus(${cand.id}, 'approved')">Approve</button>
                                                                                                                                                                                                                                                        <button class="btn btn-danger" style="padding:4px 8px;" onclick="updateCandidateStatus(${cand.id}, 'rejected')">Reject</button>
                                                                                                                                                                                                                                                                                ` : '<span style="color:var(--text-light); font-weight:600;">Evaluated</span>'}
                                                                                                                                                                                                                                                                                                    </td>
                                                                                                                                                                                                                                                                                                                    `;
                                                candTable.appendChild(tr);
                              });
                }
      }
      if (orderTable) {
                const orders = getLocalData('client_orders');
                orderTable.innerHTML = '';
                if (orders.length === 0) {
                              orderTable.innerHTML = '<tr><td colspan="6" style="text-align:center;">No client requests.</td></tr>';
                } else {
                              orders.forEach(ord => {
                                                const tr = document.createElement('tr');
                                                tr.innerHTML = `
                                                                    <td style="font-weight: 700;">${ord.company}</td>
                                                                                        <td>${ord.role}</td>
                                                                                                            <td><strong>${ord.salary}</strong></td>
                                                                                                                                <td>${ord.contact}<br><span style="color:var(--text-light); font-size:0.8rem;">${ord.email}</span></td>
                                                                                                                                                    <td><span class="badge badge-pending">searching</span></td>
                                                                                                                                                                        <td><button class="btn btn-primary" style="padding:4px 8px; font-size:0.8rem;" onclick="alert('Starting headhunting...')">Begin Source</button></td>
                                                                                                                                                                                        `;
                                                orderTable.appendChild(tr);
                              });
                }
      }
      if (shortlistTable) {
                const candidates = getLocalData('cand_submissions');
                const approvedOnly = candidates.filter(c => c.status === 'approved');
                shortlistTable.innerHTML = '';
                if (approvedOnly.length === 0) {
                              shortlistTable.innerHTML = '<tr><td colspan="4" style="text-align:center;">No active shortlists.</td></tr>';
                } else {
                              approvedOnly.forEach(cand => {
                                                const tr = document.createElement('tr');
                                                tr.innerHTML = `
                                                                    <td style="font-weight:700;">${cand.name}</td>
                                                                                        <td>${cand.job}</td>
                                                                                                            <td><span class="badge badge-approved" style="background-color:#d1fae5; color:#059669;">Delivered</span></td>
                                                                                                                                <td><button class="btn btn-danger" style="padding:4px 8px; font-size:0.8rem;" onclick="updateCandidateStatus(${cand.id}, 'pending')">Recall</button></td>
                                                                                                                                                `;
                                                shortlistTable.appendChild(tr);
                              });
                }
      }
}
function updateCandidateStatus(id, newStatus) {
      const list = getLocalData('cand_submissions');
      const updated = list.map(cand => {
                if (cand.id === id) { cand.status = newStatus; }
                return cand;
      });
      saveLocalData('cand_submissions', updated);
      alert(`Candidate status updated to: ${newStatus}`);
      renderRecruiterTables();
      renderClientShortlist();
}
function renderClientShortlist() {
      const shortlistContainer = document.getElementById('shortlist-container');
      if (shortlistContainer) {
                const candidates = getLocalData('cand_submissions');
                const approvedCandidates = candidates.filter(c => c.status === 'approved');
                const staticCards = `
                            <div class="card">
                                            <div class="card-header">
                                                                <div>
                                                                                        <h3 class="card-title">Jasur Alimov</h3>
                                                                                                                <span class="card-subtitle">Matched: Senior React Developer</span>
                                                                                                                                    </div>
                                                                                                                                                        <span class="badge badge-approved">Vetted C2</span>
                                                                                                                                                                        </div>
                                                                                                                                                                                        <div class="card-body">
                                                                                                                                                                                                            <strong>Experience:</strong> 6 Years
                                                                                                                                                                                                                                <br>
                                                                                                                                                                                                                                                    <strong>Technical Score:</strong> 94% (Passed Live Coding Assessment)
                                                                                                                                                                                                                                                                        <br>
                                                                                                                                                                                                                                                                                            <strong>Recruiter Note:</strong> Excellent communicator. Strong expertise with high-frequency databases and UI styling.
                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                            <div class="card-footer">
                                                                                                                                                                                                                                                                                                                                                <span class="salary-range">$2,800/mo expectation</span>
                                                                                                                                                                                                                                                                                                                                                                    <button class="btn btn-primary" onclick="alert('Interview scheduling request sent!')">Schedule Interview</button>
                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                            <div class="card">
                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="card-header">
                                                                                                                                                                                                                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h3 class="card-title">Nigora Islamova</h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="card-subtitle">Matched: English Department Head</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="badge badge-approved">Vetted IELTS 8.5</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="card-body">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <strong>Experience:</strong> 5 Years (Ex-British Council Staff)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <br>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <strong>Technical Score:</strong> 98% (Passed Mock Teaching Trial)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <br>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <strong>Recruiter Note:</strong> Highly professional.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="card-footer">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="salary-range">18,000,000 UZS expectation</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <button class="btn btn-primary" onclick="alert('Interview scheduling request sent!')">Schedule Interview</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        `;
                let dynamicCards = '';
                approvedCandidates.forEach(cand => {
                              if (cand.name === "Jasur Alimov" || cand.name === "Nigora Islamova") return;
                              dynamicCards += `
                                              <div class="card" style="border-top: 4px solid var(--success-color);">
                                                                  <div class="card-header">
                                                                                          <div>
                                                                                                                      <h3 class="card-title">${cand.name}</h3>
                                                                                                                                                  <span class="card-subtitle">Matched: ${cand.job}</span>
                                                                                                                                                                          </div>
                                                                                                                                                                                                  <span class="badge badge-approved">VETTED ACTIVE</span>
                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                          <div class="card-body">
                                                                                                                                                                                                                                                                  <strong>Vetted Contact:</strong> ${cand.phone} (${cand.email})
                                                                                                                                                                                                                                                                                          <br>
                                                                                                                                                                                                                                                                                                                  <strong>Top Skills:</strong> ${cand.skills}
                                                                                                                                                                                                                                                                                                                                          <br>
                                                                                                                                                                                                                                                                                                                                                                  <strong>Recruiter Assessment Note:</strong> ${cand.bio || 'Credentials verified.'}
                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                          <div class="card-footer">
                                                                                                                                                                                                                                                                                                                                                                                                                                  <span class="salary-range">Verified Candidate</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                          <button class="btn btn-primary" onclick="alert('Interview scheduling request for ${cand.name} received!')">Schedule Interview</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          `;
                });
                shortlistContainer.innerHTML = staticCards + dynamicCards;
      }
}
function clearLocalCandidates() {
      localStorage.removeItem('cand_submissions');
      localStorage.removeItem('client_orders');
      saveLocalData('cand_submissions', defaultCandidates);
      saveLocalData('client_orders', defaultOrders);
      alert('Mock databases reset!');
      renderRecruiterTables();
}
window.onload = function() {
      renderRecruiterTables();
      renderClientShortlist();
};
