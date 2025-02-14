// Country data with flags
const countries = [
  { code: 'ALL', name: 'All Countries', flag: 'https://flagcdn.com/w40/un.png' },
  { code: 'AF', name: 'Afghanistan', flag: 'https://flagcdn.com/w40/af.png' },
  { code: 'AL', name: 'Albania', flag: 'https://flagcdn.com/w40/al.png' },
  { code: 'DZ', name: 'Algeria', flag: 'https://flagcdn.com/w40/dz.png' },
  { code: 'AD', name: 'Andorra', flag: 'https://flagcdn.com/w40/ad.png' },
  { code: 'AO', name: 'Angola', flag: 'https://flagcdn.com/w40/ao.png' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: 'https://flagcdn.com/w40/ag.png' },
  { code: 'AR', name: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' },
  { code: 'AM', name: 'Armenia', flag: 'https://flagcdn.com/w40/am.png' },
  { code: 'AU', name: 'Australia', flag: 'https://flagcdn.com/w40/au.png' },
  { code: 'AT', name: 'Austria', flag: 'https://flagcdn.com/w40/at.png' },
  { code: 'AZ', name: 'Azerbaijan', flag: 'https://flagcdn.com/w40/az.png' },
  { code: 'BS', name: 'Bahamas', flag: 'https://flagcdn.com/w40/bs.png' },
  { code: 'BH', name: 'Bahrain', flag: 'https://flagcdn.com/w40/bh.png' },
  { code: 'BD', name: 'Bangladesh', flag: 'https://flagcdn.com/w40/bd.png' },
  { code: 'BB', name: 'Barbados', flag: 'https://flagcdn.com/w40/bb.png' },
  { code: 'BY', name: 'Belarus', flag: 'https://flagcdn.com/w40/by.png' },
  { code: 'BE', name: 'Belgium', flag: 'https://flagcdn.com/w40/be.png' },
  { code: 'BZ', name: 'Belize', flag: 'https://flagcdn.com/w40/bz.png' },
  { code: 'BJ', name: 'Benin', flag: 'https://flagcdn.com/w40/bj.png' },
  { code: 'BT', name: 'Bhutan', flag: 'https://flagcdn.com/w40/bt.png' },
  { code: 'BO', name: 'Bolivia', flag: 'https://flagcdn.com/w40/bo.png' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: 'https://flagcdn.com/w40/ba.png' },
  { code: 'BW', name: 'Botswana', flag: 'https://flagcdn.com/w40/bw.png' },
  { code: 'BR', name: 'Brazil', flag: 'https://flagcdn.com/w40/br.png' },
  { code: 'BN', name: 'Brunei', flag: 'https://flagcdn.com/w40/bn.png' },
  { code: 'BG', name: 'Bulgaria', flag: 'https://flagcdn.com/w40/bg.png' },
  { code: 'BF', name: 'Burkina Faso', flag: 'https://flagcdn.com/w40/bf.png' },
  { code: 'BI', name: 'Burundi', flag: 'https://flagcdn.com/w40/bi.png' },
  { code: 'KH', name: 'Cambodia', flag: 'https://flagcdn.com/w40/kh.png' },
  { code: 'CM', name: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png' },
  { code: 'CA', name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
  { code: 'CV', name: 'Cabo Verde', flag: 'https://flagcdn.com/w40/cv.png' },
  { code: 'CF', name: 'Central African Republic', flag: 'https://flagcdn.com/w40/cf.png' },
  { code: 'TD', name: 'Chad', flag: 'https://flagcdn.com/w40/td.png' },
  { code: 'CL', name: 'Chile', flag: 'https://flagcdn.com/w40/cl.png' },
  { code: 'CN', name: 'China', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: 'CO', name: 'Colombia', flag: 'https://flagcdn.com/w40/co.png' },
  { code: 'KM', name: 'Comoros', flag: 'https://flagcdn.com/w40/km.png' },
  { code: 'CR', name: 'Costa Rica', flag: 'https://flagcdn.com/w40/cr.png' },
  { code: 'HR', name: 'Croatia', flag: 'https://flagcdn.com/w40/hr.png' },
  { code: 'CU', name: 'Cuba', flag: 'https://flagcdn.com/w40/cu.png' },
  { code: 'CY', name: 'Cyprus', flag: 'https://flagcdn.com/w40/cy.png' },
  { code: 'CZ', name: 'Czechia', flag: 'https://flagcdn.com/w40/cz.png' },
  { code: 'CD', name: 'Democratic Republic of the Congo', flag: 'https://flagcdn.com/w40/cd.png' },
  { code: 'DK', name: 'Denmark', flag: 'https://flagcdn.com/w40/dk.png' },
  { code: 'DJ', name: 'Djibouti', flag: 'https://flagcdn.com/w40/dj.png' },
  { code: 'DM', name: 'Dominica', flag: 'https://flagcdn.com/w40/dm.png' },
  { code: 'DO', name: 'Dominican Republic', flag: 'https://flagcdn.com/w40/do.png' },
  { code: 'EC', name: 'Ecuador', flag: 'https://flagcdn.com/w40/ec.png' },
  { code: 'EG', name: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
  { code: 'SV', name: 'El Salvador', flag: 'https://flagcdn.com/w40/sv.png' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: 'https://flagcdn.com/w40/gq.png' },
  { code: 'ER', name: 'Eritrea', flag: 'https://flagcdn.com/w40/er.png' },
  { code: 'EE', name: 'Estonia', flag: 'https://flagcdn.com/w40/ee.png' },
  { code: 'SZ', name: 'Eswatini', flag: 'https://flagcdn.com/w40/sz.png' },
  { code: 'ET', name: 'Ethiopia', flag: 'https://flagcdn.com/w40/et.png' },
  { code: 'FM', name: 'Micronesia', flag: 'https://flagcdn.com/w40/fm.png' },
  { code: 'FJ', name: 'Fiji', flag: 'https://flagcdn.com/w40/fj.png' },
  { code: 'FI', name: 'Finland', flag: 'https://flagcdn.com/w40/fi.png' },
  { code: 'FR', name: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'GA', name: 'Gabon', flag: 'https://flagcdn.com/w40/ga.png' },
  { code: 'GM', name: 'Gambia', flag: 'https://flagcdn.com/w40/gm.png' },
  { code: 'GE', name: 'Georgia', flag: 'https://flagcdn.com/w40/ge.png' },
  { code: 'DE', name: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
  { code: 'GH', name: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
  { code: 'GR', name: 'Greece', flag: 'https://flagcdn.com/w40/gr.png' },
  { code: 'GD', name: 'Grenada', flag: 'https://flagcdn.com/w40/gd.png' },
  { code: 'GT', name: 'Guatemala', flag: 'https://flagcdn.com/w40/gt.png' },
  { code: 'GN', name: 'Guinea', flag: 'https://flagcdn.com/w40/gn.png' },
  { code: 'GW', name: 'Guinea-Bissau', flag: 'https://flagcdn.com/w40/gw.png' },
  { code: 'GY', name: 'Guyana', flag: 'https://flagcdn.com/w40/gy.png' },
  { code: 'HT', name: 'Haiti', flag: 'https://flagcdn.com/w40/ht.png' },
  { code: 'HN', name: 'Honduras', flag: 'https://flagcdn.com/w40/hn.png' },
  { code: 'HU', name: 'Hungary', flag: 'https://flagcdn.com/w40/hu.png' },
  { code: 'IS', name: 'Iceland', flag: 'https://flagcdn.com/w40/is.png' },
  { code: 'IN', name: 'India', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'ID', name: 'Indonesia', flag: 'https://flagcdn.com/w40/id.png' },
  { code: 'IR', name: 'Iran', flag: 'https://flagcdn.com/w40/ir.png' },
  { code: 'IQ', name: 'Iraq', flag: 'https://flagcdn.com/w40/iq.png' },
  { code: 'IE', name: 'Ireland', flag: 'https://flagcdn.com/w40/ie.png' },
  { code: 'IL', name: 'Israel', flag: 'https://flagcdn.com/w40/il.png' },
  { code: 'IT', name: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
  { code: 'JM', name: 'Jamaica', flag: 'https://flagcdn.com/w40/jm.png' },
  { code: 'JP', name: 'Japan', flag: 'https://flagcdn.com/w40/jp.png' },
  { code: 'JO', name: 'Jordan', flag: 'https://flagcdn.com/w40/jo.png' },
  { code: 'KZ', name: 'Kazakhstan', flag: 'https://flagcdn.com/w40/kz.png' },
  { code: 'KE', name: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
  { code: 'KI', name: 'Kiribati', flag: 'https://flagcdn.com/w40/ki.png' },
  { code: 'XK', name: 'Kosovo', flag: 'https://flagcdn.com/w40/xk.png' },
  { code: 'KW', name: 'Kuwait', flag: 'https://flagcdn.com/w40/kw.png' },
  { code: 'KG', name: 'Kyrgyzstan', flag: 'https://flagcdn.com/w40/kg.png' },
  { code: 'LA', name: 'Laos', flag: 'https://flagcdn.com/w40/la.png' },
  { code: 'LV', name: 'Latvia', flag: 'https://flagcdn.com/w40/lv.png' },
  { code: 'LB', name: 'Lebanon', flag: 'https://flagcdn.com/w40/lb.png' },
  { code: 'LS', name: 'Lesotho', flag: 'https://flagcdn.com/w40/ls.png' },
  { code: 'LR', name: 'Liberia', flag: 'https://flagcdn.com/w40/lr.png' },
  { code: 'LY', name: 'Libya', flag: 'https://flagcdn.com/w40/ly.png' },
  { code: 'LI', name: 'Liechtenstein', flag: 'https://flagcdn.com/w40/li.png' },
  { code: 'LT', name: 'Lithuania', flag: 'https://flagcdn.com/w40/lt.png' },
  { code: 'LU', name: 'Luxembourg', flag: 'https://flagcdn.com/w40/lu.png' },
  { code: 'MG', name: 'Madagascar', flag: 'https://flagcdn.com/w40/mg.png' },
  { code: 'MW', name: 'Malawi', flag: 'https://flagcdn.com/w40/mw.png' },
  { code: 'MY', name: 'Malaysia', flag: 'https://flagcdn.com/w40/my.png' },
  { code: 'MV', name: 'Maldives', flag: 'https://flagcdn.com/w40/mv.png' },
  { code: 'ML', name: 'Mali', flag: 'https://flagcdn.com/w40/ml.png' },
  { code: 'MT', name: 'Malta', flag: 'https://flagcdn.com/w40/mt.png' },
  { code: 'MH', name: 'Marshall Islands', flag: 'https://flagcdn.com/w40/mh.png' },
  { code: 'MR', name: 'Mauritania', flag: 'https://flagcdn.com/w40/mr.png' },
  { code: 'MU', name: 'Mauritius', flag: 'https://flagcdn.com/w40/mu.png' },
  { code: 'MX', name: 'Mexico', flag: 'https://flagcdn.com/w40/mx.png' },
  { code: 'MD', name: 'Moldova', flag: 'https://flagcdn.com/w40/md.png' },
  { code: 'MC', name: 'Monaco', flag: 'https://flagcdn.com/w40/mc.png' },
  { code: 'MN', name: 'Mongolia', flag: 'https://flagcdn.com/w40/mn.png' },
  { code: 'ME', name: 'Montenegro', flag: 'https://flagcdn.com/w40/me.png' },
  { code: 'MA', name: 'Morocco', flag: 'https://flagcdn.com/w40/ma.png' },
  { code: 'MZ', name: 'Mozambique', flag: 'https://flagcdn.com/w40/mz.png' },
  { code: 'MM', name: 'Myanmar', flag: 'https://flagcdn.com/w40/mm.png' },
  { code: 'NA', name: 'Namibia', flag: 'https://flagcdn.com/w40/na.png' },
  { code: 'NR', name: 'Nauru', flag: 'https://flagcdn.com/w40/nr.png' },
  { code: 'NP', name: 'Nepal', flag: 'https://flagcdn.com/w40/np.png' },
  { code: 'NL', name: 'Netherlands', flag: 'https://flagcdn.com/w40/nl.png' },
  { code: 'NZ', name: 'New Zealand', flag: 'https://flagcdn.com/w40/nz.png' },
  { code: 'NI', name: 'Nicaragua', flag: 'https://flagcdn.com/w40/ni.png' },
  { code: 'NE', name: 'Niger', flag: 'https://flagcdn.com/w40/ne.png' },
  { code: 'NG', name: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
  { code: 'KP', name: 'North Korea', flag: 'https://flagcdn.com/w40/kp.png' },
  { code: 'MK', name: 'North Macedonia', flag: 'https://flagcdn.com/w40/mk.png' },
  { code: 'NO', name: 'Norway', flag: 'https://flagcdn.com/w40/no.png' },
  { code: 'OM', name: 'Oman', flag: 'https://flagcdn.com/w40/om.png' },
  { code: 'PK', name: 'Pakistan', flag: 'https://flagcdn.com/w40/pk.png' },
  { code: 'PW', name: 'Palau', flag: 'https://flagcdn.com/w40/pw.png' },
  { code: 'PS', name: 'Palestine', flag: 'https://flagcdn.com/w40/ps.png' },
  { code: 'PA', name: 'Panama', flag: 'https://flagcdn.com/w40/pa.png' },
  { code: 'PG', name: 'Papua New Guinea', flag: 'https://flagcdn.com/w40/pg.png' },
  { code: 'PY', name: 'Paraguay', flag: 'https://flagcdn.com/w40/py.png' },
  { code: 'PE', name: 'Peru', flag: 'https://flagcdn.com/w40/pe.png' },
  { code: 'PH', name: 'Philippines', flag: 'https://flagcdn.com/w40/ph.png' },
  { code: 'PL', name: 'Poland', flag: 'https://flagcdn.com/w40/pl.png' },
  { code: 'PT', name: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' },
  { code: 'QA', name: 'Qatar', flag: 'https://flagcdn.com/w40/qa.png' },
  { code: 'CG', name: 'Republic of the Congo', flag: 'https://flagcdn.com/w40/cg.png' },
  { code: 'RO', name: 'Romania', flag: 'https://flagcdn.com/w40/ro.png' },
  { code: 'RU', name: 'Russia', flag: 'https://flagcdn.com/w40/ru.png' },
  { code: 'RW', name: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: 'https://flagcdn.com/w40/kn.png' },
  { code: 'LC', name: 'Saint Lucia', flag: 'https://flagcdn.com/w40/lc.png' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: 'https://flagcdn.com/w40/vc.png' },
  { code: 'WS', name: 'Samoa', flag: 'https://flagcdn.com/w40/ws.png' },
  { code: 'SM', name: 'San Marino', flag: 'https://flagcdn.com/w40/sm.png' },
  { code: 'ST', name: 'Sao Tome and Principe', flag: 'https://flagcdn.com/w40/st.png' },
  { code: 'SA', name: 'Saudi Arabia', flag: 'https://flagcdn.com/w40/sa.png' },
  { code: 'SN', name: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' },
  { code: 'RS', name: 'Serbia', flag: 'https://flagcdn.com/w40/rs.png' },
  { code: 'SC', name: 'Seychelles', flag: 'https://flagcdn.com/w40/sc.png' },
  { code: 'SL', name: 'Sierra Leone', flag: 'https://flagcdn.com/w40/sl.png' },
  { code: 'SG', name: 'Singapore', flag: 'https://flagcdn.com/w40/sg.png' },
  { code: 'SK', name: 'Slovakia', flag: 'https://flagcdn.com/w40/sk.png' },
  { code: 'SI', name: 'Slovenia', flag: 'https://flagcdn.com/w40/si.png' },
  { code: 'SB', name: 'Solomon Islands', flag: 'https://flagcdn.com/w40/sb.png' },
  { code: 'SO', name: 'Somalia', flag: 'https://flagcdn.com/w40/so.png' },
  { code: 'ZA', name: 'South Africa', flag: 'https://flagcdn.com/w40/za.png' },
  { code: 'KR', name: 'South Korea', flag: 'https://flagcdn.com/w40/kr.png' },
  { code: 'SS', name: 'South Sudan', flag: 'https://flagcdn.com/w40/ss.png' },
  { code: 'ES', name: 'Spain', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'LK', name: 'Sri Lanka', flag: 'https://flagcdn.com/w40/lk.png' },
  { code: 'SD', name: 'Sudan', flag: 'https://flagcdn.com/w40/sd.png' },
  { code: 'SR', name: 'Suriname', flag: 'https://flagcdn.com/w40/sr.png' },
  { code: 'SE', name: 'Sweden', flag: 'https://flagcdn.com/w40/se.png' },
  { code: 'CH', name: 'Switzerland', flag: 'https://flagcdn.com/w40/ch.png' },
  { code: 'SY', name: 'Syria', flag: 'https://flagcdn.com/w40/sy.png' },
  { code: 'TW', name: 'Taiwan', flag: 'https://flagcdn.com/w40/tw.png' },
  { code: 'TJ', name: 'Tajikistan', flag: 'https://flagcdn.com/w40/tj.png' },
  { code: 'TZ', name: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png' },
  { code: 'TH', name: 'Thailand', flag: 'https://flagcdn.com/w40/th.png' },
  { code: 'TL', name: 'Timor-Leste', flag: 'https://flagcdn.com/w40/tl.png' },
  { code: 'TG', name: 'Togo', flag: 'https://flagcdn.com/w40/tg.png' },
  { code: 'TO', name: 'Tonga', flag: 'https://flagcdn.com/w40/to.png' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: 'https://flagcdn.com/w40/tt.png' },
  { code: 'TN', name: 'Tunisia', flag: 'https://flagcdn.com/w40/tn.png' },
  { code: 'TR', name: 'Turkey', flag: 'https://flagcdn.com/w40/tr.png' },
  { code: 'TM', name: 'Turkmenistan', flag: 'https://flagcdn.com/w40/tm.png' },
  { code: 'TV', name: 'Tuvalu', flag: 'https://flagcdn.com/w40/tv.png' },
  { code: 'UG', name: 'Uganda', flag: 'https://flagcdn.com/w40/ug.png' },
  { code: 'UA', name: 'Ukraine', flag: 'https://flagcdn.com/w40/ua.png' },
  { code: 'AE', name: 'United Arab Emirates', flag: 'https://flagcdn.com/w40/ae.png' },
  { code: 'GB', name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: 'US', name: 'United States', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'UY', name: 'Uruguay', flag: 'https://flagcdn.com/w40/uy.png' },
  { code: 'UZ', name: 'Uzbekistan', flag: 'https://flagcdn.com/w40/uz.png' },
  { code: 'VU', name: 'Vanuatu', flag: 'https://flagcdn.com/w40/vu.png' },
  { code: 'VA', name: 'Vatican City', flag: 'https://flagcdn.com/w40/va.png' },
  { code: 'VE', name: 'Venezuela', flag: 'https://flagcdn.com/w40/ve.png' },
  { code: 'VN', name: 'Vietnam', flag: 'https://flagcdn.com/w40/vn.png' },
  { code: 'YE', name: 'Yemen', flag: 'https://flagcdn.com/w40/ye.png' },
  { code: 'ZM', name: 'Zambia', flag: 'https://flagcdn.com/w40/zm.png' },
  { code: 'ZW', name: 'Zimbabwe', flag: 'https://flagcdn.com/w40/zw.png' }
];


class NotificationManager {
    constructor() {
        this.selectedCountries = new Set();
        this.selectedDevice = 'all';
        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        // Initialize country list
        this.populateCountryList();
        
        // Set user email in header
        const userSession = JSON.parse(sessionStorage.getItem('userSession'));
        if (!userSession) {
            window.location.href = '../index.html';
            return;
        }
        document.getElementById('userEmail').textContent = userSession.email;
    }

    populateCountryList() {
        const countryList = document.getElementById('countryList');
        countries.forEach(country => {
            const option = document.createElement('div');
            option.className = 'country-option';
            option.dataset.code = country.code;
            option.innerHTML = `
                <img src="${country.flag}" alt="${country.name}" class="country-flag">
                <span>${country.name}</span>
            `;
            countryList.appendChild(option);
        });
    }

    updateSelectedCountries() {
        const container = document.getElementById('selectedCountries');
        container.innerHTML = '';
        
        this.selectedCountries.forEach(code => {
            const country = countries.find(c => c.code === code);
            if (country) {
                const tag = document.createElement('div');
                tag.className = 'selected-country-tag';
                tag.innerHTML = `
                    <img src="${country.flag}" alt="${country.name}" class="country-flag">
                    <span>${country.name}</span>
                    <span class="remove-country" data-code="${code}">&times;</span>
                `;
                container.appendChild(tag);
            }
        });
    }

    setupEventListeners() {
        // Country selection
        document.getElementById('countryList').addEventListener('click', (e) => {
            const option = e.target.closest('.country-option');
            if (option) {
                const code = option.dataset.code;
                if (code === 'ALL') {
                    this.selectedCountries.clear();
                    this.selectedCountries.add('ALL');
                } else {
                    this.selectedCountries.delete('ALL');
                    if (this.selectedCountries.has(code)) {
                        this.selectedCountries.delete(code);
                    } else {
                        this.selectedCountries.add(code);
                    }
                }
                this.updateSelectedCountries();
            }
        });

        // Remove selected country
        document.getElementById('selectedCountries').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-country')) {
                const code = e.target.dataset.code;
                this.selectedCountries.delete(code);
                this.updateSelectedCountries();
            }
        });

        // Country search
        document.getElementById('countrySearch').addEventListener('input', (e) => {
            const search = e.target.value.toLowerCase();
            const options = document.querySelectorAll('.country-option');
            options.forEach(option => {
                const name = option.querySelector('span').textContent.toLowerCase();
                option.style.display = name.includes(search) ? 'flex' : 'none';
            });
        });

        // Device targeting
        document.getElementById('deviceTargeting').addEventListener('click', (e) => {
            const option = e.target.closest('.device-option');
            if (option) {
                document.querySelectorAll('.device-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                this.selectedDevice = option.dataset.device;
            }
        });

        // Form submission
        document.getElementById('notificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendNotification();
        });

        // Save template
        document.getElementById('saveTemplate').addEventListener('click', () => {
            this.saveAsTemplate();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('userSession');
            window.location.href = '../index.html';
        });
    }

    async sendNotification() {
        try {
            const formData = {
                campaignName: document.getElementById('campaignName').value,
                title: document.getElementById('notificationTitle').value,
                message: document.getElementById('notificationMessage').value,
                countries: Array.from(this.selectedCountries),
                deviceTarget: this.selectedDevice,
                icon: document.getElementById('notificationIcon').files[0],
                image: document.getElementById('notificationImage').files[0],
                clickAction: document.getElementById('clickAction').value,
                scheduleTime: document.getElementById('scheduleTime').value
            };

            // TODO: Send to backend
            console.log('Sending notification:', formData);
            
            // Show success message
            alert('Notification scheduled successfully!');
            
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Error sending notification: ' + error.message);
        }
    }

    async saveAsTemplate() {
        try {
            const templateData = {
                name: document.getElementById('campaignName').value,
                title: document.getElementById('notificationTitle').value,
                message: document.getElementById('notificationMessage').value,
                countries: Array.from(this.selectedCountries),
                deviceTarget: this.selectedDevice,
                clickAction: document.getElementById('clickAction').value
            };

            // TODO: Save to backend
            console.log('Saving template:', templateData);
            
            alert('Template saved successfully!');
            
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Error saving template: ' + error.message);
        }
    }
}

// Initialize NotificationManager when DOM is loaded
let notificationManager;
document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
});