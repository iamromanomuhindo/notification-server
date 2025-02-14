// Country data with flags
const countries = [
    { code: 'ALL', name: 'All Countries', flag: 'https://flagcdn.com/w40/un.png' },
    { code: 'AF', name: 'Afghanistan', flag: 'https://flagcdn.com/w40/af.png' },
    { code: 'AX', name: 'Åland Islands', flag: 'https://flagcdn.com/w40/ax.png' },
    { code: 'AL', name: 'Albania', flag: 'https://flagcdn.com/w40/al.png' },
    { code: 'DZ', name: 'Algeria', flag: 'https://flagcdn.com/w40/dz.png' },
    { code: 'AS', name: 'American Samoa', flag: 'https://flagcdn.com/w40/as.png' },
    { code: 'AD', name: 'Andorra', flag: 'https://flagcdn.com/w40/ad.png' },
    { code: 'AO', name: 'Angola', flag: 'https://flagcdn.com/w40/ao.png' },
    { code: 'AI', name: 'Anguilla', flag: 'https://flagcdn.com/w40/ai.png' },
    { code: 'AQ', name: 'Antarctica', flag: 'https://flagcdn.com/w40/aq.png' },
    { code: 'AG', name: 'Antigua and Barbuda', flag: 'https://flagcdn.com/w40/ag.png' },
    { code: 'AR', name: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' },
    { code: 'AM', name: 'Armenia', flag: 'https://flagcdn.com/w40/am.png' },
    { code: 'AW', name: 'Aruba', flag: 'https://flagcdn.com/w40/aw.png' },
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
    { code: 'BM', name: 'Bermuda', flag: 'https://flagcdn.com/w40/bm.png' },
    { code: 'BT', name: 'Bhutan', flag: 'https://flagcdn.com/w40/bt.png' },
    { code: 'BO', name: 'Bolivia', flag: 'https://flagcdn.com/w40/bo.png' },
    { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba', flag: 'https://flagcdn.com/w40/bq.png' },
    { code: 'BA', name: 'Bosnia and Herzegovina', flag: 'https://flagcdn.com/w40/ba.png' },
    { code: 'BW', name: 'Botswana', flag: 'https://flagcdn.com/w40/bw.png' },
    { code: 'BV', name: 'Bouvet Island', flag: 'https://flagcdn.com/w40/bv.png' },
    { code: 'BR', name: 'Brazil', flag: 'https://flagcdn.com/w40/br.png' },
    { code: 'IO', name: 'British Indian Ocean Territory', flag: 'https://flagcdn.com/w40/io.png' },
    { code: 'BN', name: 'Brunei Darussalam', flag: 'https://flagcdn.com/w40/bn.png' },
    { code: 'BG', name: 'Bulgaria', flag: 'https://flagcdn.com/w40/bg.png' },
    { code: 'BF', name: 'Burkina Faso', flag: 'https://flagcdn.com/w40/bf.png' },
    { code: 'BI', name: 'Burundi', flag: 'https://flagcdn.com/w40/bi.png' },
    { code: 'CV', name: 'Cabo Verde', flag: 'https://flagcdn.com/w40/cv.png' },
    { code: 'KH', name: 'Cambodia', flag: 'https://flagcdn.com/w40/kh.png' },
    { code: 'CM', name: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png' },
    { code: 'CA', name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
    { code: 'KY', name: 'Cayman Islands', flag: 'https://flagcdn.com/w40/ky.png' },
    { code: 'CF', name: 'Central African Republic', flag: 'https://flagcdn.com/w40/cf.png' },
    { code: 'TD', name: 'Chad', flag: 'https://flagcdn.com/w40<td.png' },
    { code: 'CL', name: 'Chile', flag: 'https://flagcdn.com/w40/cl.png' },
    { code: 'CN', name: 'China', flag: 'https://flagcdn.com/w40/cn.png' },
    { code: 'CX', name: 'Christmas Island', flag: 'https://flagcdn.com/w40/cx.png' },
    { code: 'CC', name: 'Cocos (Keeling) Islands', flag: 'https://flagcdn.com/w40/cc.png' },
    { code: 'CO', name: 'Colombia', flag: 'https://flagcdn.com/w40/co.png' },
    { code: 'KM', name: 'Comoros', flag: 'https://flagcdn.com/w40/km.png' },
    { code: 'CG', name: 'Congo', flag: 'https://flagcdn.com/w40/cg.png' },
    { code: 'CD', name: 'Congo (Democratic Republic of the)', flag: 'https://flagcdn.com/w40/cd.png' },
    { code: 'CK', name: 'Cook Islands', flag: 'https://flagcdn.com/w40/ck.png' },
    { code: 'CR', name: 'Costa Rica', flag: 'https://flagcdn.com/w40/cr.png' },
    { code: 'HR', name: 'Croatia', flag: 'https://flagcdn.com/w40/hr.png' },
    { code: 'CU', name: 'Cuba', flag: 'https://flagcdn.com/w40/cu.png' },
    { code: 'CW', name: 'Curaçao', flag: 'https://flagcdn.com/w40/cw.png' },
    { code: 'CY', name: 'Cyprus', flag: 'https://flagcdn.com/w40/cy.png' },
    { code: 'CZ', name: 'Czechia', flag: 'https://flagcdn.com/w40/cz.png' },
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
    { code: 'FK', name: 'Falkland Islands [Malvinas]', flag: 'https://flagcdn.com/w40/fk.png' },
    { code: 'FO', name: 'Faroe Islands', flag: 'https://flagcdn.com/w40/fo.png' },
    { code: 'FJ', name: 'Fiji', flag: 'https://flagcdn.com/w40/fj.png' },
    { code: 'FI', name: 'Finland', flag: 'https://flagcdn.com/w40/fi.png' },
    { code: 'FR', name: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'GF', name: 'French Guiana', flag: 'https://flagcdn.com/w40/gf.png' },
    { code: 'PF', name: 'French Polynesia', flag: 'https://flagcdn.com/w40/pf.png' },
    { code: 'TF', name: 'French Southern Territories', flag: 'https://flagcdn.com/w40/tf.png' },
    { code: 'GA', name: 'Gabon', flag: 'https://flagcdn.com/w40/ga.png' },
    { code: 'GM', name: 'Gambia', flag: 'https://flagcdn.com/w40/gm.png' },
    { code: 'GE', name: 'Georgia', flag: 'https://flagcdn.com/w40/ge.png' },
    { code: 'DE', name: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
    { code: 'GH', name: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
    { code: 'GI', name: 'Gibraltar', flag: 'https://flagcdn.com/w40/gi.png' },
    { code: 'GR', name: 'Greece', flag: 'https://flagcdn.com/w40/gr.png' },
    { code: 'GL', name: 'Greenland', flag: 'https://flagcdn.com/w40/gl.png' },
    { code: 'GD', name: 'Grenada', flag: 'https://flagcdn.com/w40/gd.png' },
    { code: 'GP', name: 'Guadeloupe', flag: 'https://flagcdn.com/w40/gp.png' },
    { code: 'GU', name: 'Guam', flag: 'https://flagcdn.com/w40/gu.png' },
    { code: 'GT', name: 'Guatemala', flag: 'https://flagcdn.com/w40/gt.png' },
    { code: 'GG', name: 'Guernsey', flag: 'https://flagcdn.com/w40/gg.png' },
    { code: 'GN', name: 'Guinea', flag: 'https://flagcdn.com/w40/gn.png' },
    { code: 'GW', name: 'Guinea-Bissau', flag: 'https://flagcdn.com/w40/gw.png' },
    { code: 'GY', name: 'Guyana', flag: 'https://flagcdn.com/w40/gy.png' },
    { code: 'HT', name: 'Haiti', flag: 'https://flagcdn.com/w40/ht.png' },
    { code: 'HM', name: 'Heard Island and McDonald Islands', flag: 'https://flagcdn.com/w40/hm.png' },
    { code: 'VA', name: 'Holy See', flag: 'https://flagcdn.com/w40/va.png' },
    { code: 'HN', name: 'Honduras', flag: 'https://flagcdn.com/w40/hn.png' },
    { code: 'HK', name: 'Hong Kong', flag: 'https://flagcdn.com/w40/hk.png' },
    { code: 'HU', name: 'Hungary', flag: 'https://flagcdn.com/w40/hu.png' },
    { code: 'IS', name: 'Iceland', flag: 'https://flagcdn.com/w40/is.png' },
    { code: 'IN', name: 'India', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'ID', name: 'Indonesia', flag: 'https://flagcdn.com/w40/id.png' },
    { code: 'IR', name: 'Iran', flag: 'https://flagcdn.com/w40/ir.png' },
    { code: 'IQ', name: 'Iraq', flag: 'https://flagcdn.com/w40/iq.png' },
    { code: 'IE', name: 'Ireland', flag: 'https://flagcdn.com/w40/ie.png' },
    { code: 'IM', name: 'Isle of Man', flag: 'https://flagcdn.com/w40/im.png' },
    { code: 'IL', name: 'Israel', flag: 'https://flagcdn.com/w40/il.png' },
    { code: 'IT', name: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
    { code: 'JM', name: 'Jamaica', flag: 'https://flagcdn.com/w40/jm.png' },
    { code: 'JP', name: 'Japan', flag: 'https://flagcdn.com/w40/jp.png' },
    { code: 'JE', name: 'Jersey', flag: 'https://flagcdn.com/w40/je.png' },
    { code: 'JO', name: 'Jordan', flag: 'https://flagcdn.com/w40/jo.png' },
    { code: 'KZ', name: 'Kazakhstan', flag: 'https://flagcdn.com/w40/kz.png' },
    { code: 'KE', name: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
    { code: 'KI', name: 'Kiribati', flag: 'https://flagcdn.com/w40/ki.png' },
    { code: 'KP', name: 'North Korea', flag: 'https://flagcdn.com/w40/kp.png' },
    { code: 'KR', name: 'South Korea', flag: 'https://flagcdn.com/w40/kr.png' },
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
    { code: 'MO', name: 'Macao', flag: 'https://flagcdn.com/w40/mo.png' },
    { code: 'MG', name: 'Madagascar', flag: 'https://flagcdn.com/w40/mg.png' },
    { code: 'MW', name: 'Malawi', flag: 'https://flagcdn.com/w40/mw.png' },
    { code: 'MY', name: 'Malaysia', flag: 'https://flagcdn.com/w40/my.png' },
    { code: 'MV', name: 'Maldives', flag: 'https://flagcdn.com/w40/mv.png' },
    { code: 'ML', name: 'Mali', flag: 'https://flagcdn.com/w40/ml.png' },
    { code: 'MT', name: 'Malta', flag: 'https://flagcdn.com/w40/mt.png' },
    { code: 'MH', name: 'Marshall Islands', flag: 'https://flagcdn.com/w40/mh.png' },
    { code: 'MQ', name: 'Martinique', flag: 'https://flagcdn.com/w40/mq.png' },
    { code: 'MR', name: 'Mauritania', flag: 'https://flagcdn.com/w40/mr.png' },
    { code: 'MU', name: 'Mauritius', flag: 'https://flagcdn.com/w40/mu.png' },
    { code: 'YT', name: 'Mayotte', flag: 'https://flagcdn.com/w40/yt.png' },
    { code: 'MX', name: 'Mexico', flag: 'https://flagcdn.com/w40/mx.png' },
    { code: 'FM', name: 'Micronesia', flag: 'https://flagcdn.com/w40/fm.png' },
    { code: 'MD', name: 'Moldova', flag: 'https://flagcdn.com/w40/md.png' },
    { code: 'MC', name: 'Monaco', flag: 'https://flagcdn.com/w40/mc.png' },
    { code: 'MN', name: 'Mongolia', flag: 'https://flagcdn.com/w40/mn.png' },
    { code: 'ME', name: 'Montenegro', flag: 'https://flagcdn.com/w40/me.png' },
    { code: 'MS', name: 'Montserrat', flag: 'https://flagcdn.com/w40/ms.png' },
    { code: 'MA', name: 'Morocco', flag: 'https://flagcdn.com/w40/ma.png' },
    { code: 'MZ', name: 'Mozambique', flag: 'https://flagcdn.com/w40/mz.png' },
    { code: 'MM', name: 'Myanmar', flag: 'https://flagcdn.com/w40/mm.png' },
    { code: 'NA', name: 'Namibia', flag: 'https://flagcdn.com/w40/na.png' },
    { code: 'NR', name: 'Nauru', flag: 'https://flagcdn.com/w40/nr.png' },
    { code: 'NP', name: 'Nepal', flag: 'https://flagcdn.com/w40/np.png' },
    { code: 'NL', name: 'Netherlands', flag: 'https://flagcdn.com/w40/nl.png' },
    { code: 'NC', name: 'New Caledonia', flag: 'https://flagcdn.com/w40/nc.png' },
    { code: 'NZ', name: 'New Zealand', flag: 'https://flagcdn.com/w40/nz.png' },
    { code: 'NI', name: 'Nicaragua', flag: 'https://flagcdn.com/w40/ni.png' },
    { code: 'NE', name: 'Niger', flag: 'https://flagcdn.com/w40/ne.png' },
    { code: 'NG', name: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
    { code: 'NU', name: 'Niue', flag: 'https://flagcdn.com/w40/nu.png' },
    { code: 'NF', name: 'Norfolk Island', flag: 'https://flagcdn.com/w40/nf.png' },
    { code: 'MK', name: 'North Macedonia', flag: 'https://flagcdn.com/w40/mk.png' },
    { code: 'MP', name: 'Northern Mariana Islands', flag: 'https://flagcdn.com/w40/mp.png' },
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
    { code: 'PN', name: 'Pitcairn', flag: 'https://flagcdn.com/w40/pn.png' },
    { code: 'PL', name: 'Poland', flag: 'https://flagcdn.com/w40/pl.png' },
    { code: 'PT', name: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' },
    { code: 'PR', name: 'Puerto Rico', flag: 'https://flagcdn.com/w40/pr.png' },
    { code: 'QA', name: 'Qatar', flag: 'https://flagcdn.com/w40/qa.png' },
    { code: 'RE', name: 'Réunion', flag: 'https://flagcdn.com/w40/re.png' },
    { code: 'RO', name: 'Romania', flag: 'https://flagcdn.com/w40/ro.png' },
    { code: 'RU', name: 'Russia', flag: 'https://flagcdn.com/w40/ru.png' },
    { code: 'RW', name: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png' },
    { code: 'BL', name: 'Saint Barthélemy', flag: 'https://flagcdn.com/w40/bl.png' },
    { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha', flag: 'https://flagcdn.com/w40/sh.png' },
    { code: 'KN', name: 'Saint Kitts and Nevis', flag: 'https://flagcdn.com/w40/kn.png' },
    { code: 'LC', name: 'Saint Lucia', flag: 'https://flagcdn.com/w40/lc.png' },
    { code: 'MF', name: 'Saint Martin', flag: 'https://flagcdn.com/w40/mf.png' },
    { code: 'PM', name: 'Saint Pierre and Miquelon', flag: 'https://flagcdn.com/w40/pm.png' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: 'https://flagcdn.com/w40/vc.png' },
    { code: 'WS', name: 'Samoa', flag: 'https://flagcdn.com/w40/ws.png' },
    { code: 'SM', name: 'San Marino', flag: 'https://flagcdn.com/w40/sm.png' },
    { code: 'ST', name: 'São Tomé and Príncipe', flag: 'https://flagcdn.com/w40/st.png' },
    { code: 'SA', name: 'Saudi Arabia', flag: 'https://flagcdn.com/w40/sa.png' },
    { code: 'SN', name: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' },
    { code: 'RS', name: 'Serbia', flag: 'https://flagcdn.com/w40/rs.png' },
    { code: 'SC', name: 'Seychelles', flag: 'https://flagcdn.com/w40/sc.png' },
    { code: 'SL', name: 'Sierra Leone', flag: 'https://flagcdn.com/w40/sl.png' },
    { code: 'SG', name: 'Singapore', flag: 'https://flagcdn.com/w40/sg.png' },
    { code: 'SX', name: 'Sint Maarten', flag: 'https://flagcdn.com/w40/sx.png' },
    { code: 'SK', name: 'Slovakia', flag: 'https://flagcdn.com/w40/sk.png' },
    { code: 'SI', name: 'Slovenia', flag: 'https://flagcdn.com/w40/si.png' },
    { code: 'SB', name: 'Solomon Islands', flag: 'https://flagcdn.com/w40/sb.png' },
    { code: 'SO', name: 'Somalia', flag: 'https://flagcdn.com/w40/so.png' },
    { code: 'ZA', name: 'South Africa', flag: 'https://flagcdn.com/w40/za.png' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands', flag: 'https://flagcdn.com/w40/gs.png' },
    { code: 'SS', name: 'South Sudan', flag: 'https://flagcdn.com/w40/ss.png' },
    { code: 'ES', name: 'Spain', flag: 'https://flagcdn.com/w40/es.png' },
    { code: 'LK', name: 'Sri Lanka', flag: 'https://flagcdn.com/w40/lk.png' },
    { code: 'SD', name: 'Sudan', flag: 'https://flagcdn.com/w40/sd.png' },
    { code: 'SR', name: 'Suriname', flag: 'https://flagcdn.com/w40/sr.png' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen', flag: 'https://flagcdn.com/w40/sj.png' },
    { code: 'SE', name: 'Sweden', flag: 'https://flagcdn.com/w40/se.png' },
    { code: 'CH', name: 'Switzerland', flag: 'https://flagcdn.com/w40/ch.png' },
    { code: 'SY', name: 'Syria', flag: 'https://flagcdn.com/w40/sy.png' },
    { code: 'TW', name: 'Taiwan', flag: 'https://flagcdn.com/w40/tw.png' },
    { code: 'TJ', name: 'Tajikistan', flag: 'https://flagcdn.com/w40/tj.png' },
    { code: 'TZ', name: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png' },
    { code: 'TH', name: 'Thailand', flag: 'https://flagcdn.com/w40/th.png' },
    { code: 'TL', name: 'Timor-Leste', flag: 'https://flagcdn.com/w40/tl.png' },
    { code: 'TG', name: 'Togo', flag: 'https://flagcdn.com/w40/tg.png' },
    { code: 'TK', name: 'Tokelau', flag: 'https://flagcdn.com/w40/tk.png' },
    { code: 'TO', name: 'Tonga', flag: 'https://flagcdn.com/w40/to.png' },
    { code: 'TT', name: 'Trinidad and Tobago', flag: 'https://flagcdn.com/w40/tt.png' },
    { code: 'TN', name: 'Tunisia', flag: 'https://flagcdn.com/w40/tn.png' },
    { code: 'TR', name: 'Turkey', flag: 'https://flagcdn.com/w40/tr.png' },
    { code: 'TM', name: 'Turkmenistan', flag: 'https://flagcdn.com/w40/tm.png' },
    { code: 'TC', name: 'Turks and Caicos Islands', flag: 'https://flagcdn.com/w40/tc.png' },
    { code: 'TV', name: 'Tuvalu', flag: 'https://flagcdn.com/w40/tv.png' },
    { code: 'UG', name: 'Uganda', flag: 'https://flagcdn.com/w40/ug.png' },
    { code: 'UA', name: 'Ukraine', flag: 'https://flagcdn.com/w40/ua.png' },
    { code: 'AE', name: 'United Arab Emirates', flag: 'https://flagcdn.com/w40/ae.png' },
    { code: 'GB', name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'US', name: 'United States', flag: 'https://flagcdn.com/w40/us.png' },
    { code: 'UM', name: 'United States Minor Outlying Islands', flag: 'https://flagcdn.com/w40/um.png' },
    { code: 'UY', name: 'Uruguay', flag: 'https://flagcdn.com/w40/uy.png' },
    { code: 'UZ', name: 'Uzbekistan', flag: 'https://flagcdn.com/w40/uz.png' },
    { code: 'VU', name: 'Vanuatu', flag: 'https://flagcdn.com/w40/vu.png' },
    { code: 'VE', name: 'Venezuela', flag: 'https://flagcdn.com/w40/ve.png' },
    { code: 'VN', name: 'Vietnam', flag: 'https://flagcdn.com/w40/vn.png' },
    { code: 'VG', name: 'Virgin Islands (British)', flag: 'https://flagcdn.com/w40/vg.png' },
    { code: 'VI', name: 'Virgin Islands (U.S.)', flag: 'https://flagcdn.com/w40/vi.png' },
    { code: 'WF', name: 'Wallis and Futuna', flag: 'https://flagcdn.com/w40/wf.png' },
    { code: 'EH', name: 'Western Sahara', flag: 'https://flagcdn.com/w40/eh.png' },
    { code: 'YE', name: 'Yemen', flag: 'https://flagcdn.com/w40/ye.png' },
    { code: 'ZM', name: 'Zambia', flag: 'https://flagcdn.com/w40/zm.png' },
    { code: 'ZW', name: 'Zimbabwe', flag: 'https://flagcdn.com/w40/zw.png' }
];

class NotificationManager {
    constructor() {
        this.supabase = window.supabase.createClient(
            config.supabase.url,
            config.supabase.anonKey
        );

        // Log connection details
        console.log('Initializing Supabase connection:', config.supabase.url);
        
        // Test connection
        this.testConnection();

        this.selectedCountries = new Set();
        this.selectedDevice = 'all';
        this.uploadProgress = {
            icon: 0,
            image: 0
        };
        this.imageUrls = {
            icon: null,
            image: null
        };
        this.subscriberCounts = {};

        this.initializeUI();
        this.setupEventListeners();
        this.loadSubscriberCounts();
        this.initializeCountrySelector();
        this.updatePreview();
    }

    async testConnection() {
        try {
            const { data, error } = await this.supabase.rpc('version');
            if (error) {
                console.error('Supabase connection failed:', error);
            } else {
                console.log('Supabase connected successfully');
            }
        } catch (err) {
            console.error('Connection test error:', err);
        }
    }

    async loadSubscriberCounts() {
        try {
            const { data, error } = await this.supabase
                .from('subscribers')
                .select('country')
                .not('country', 'is', null);

            if (error) throw error;

            // Create a mapping of country names to codes
            const countryNameToCode = {};
            countries.forEach(country => {
                countryNameToCode[country.name] = country.code;
            });

            // Count subscribers by country code
            this.subscriberCounts = data.reduce((acc, sub) => {
                // Find the country code for this country name
                const countryCode = countryNameToCode[sub.country];
                if (countryCode) {
                    acc[countryCode] = (acc[countryCode] || 0) + 1;
                }
                return acc;
            }, {});

            // Calculate total subscribers for 'ALL' option
            this.subscriberCounts['ALL'] = Object.values(this.subscriberCounts).reduce((a, b) => a + b, 0);

            // Update the country list with new counts
            this.initializeCountrySelector();
        } catch (error) {
            console.error('Error loading subscriber counts:', error);
        }
    }

    initializeUI() {
        // Initialize UI elements
        this.countrySearchInput = document.getElementById('countrySearch');
        this.countryList = document.getElementById('countryList');
        this.selectedCountriesContainer = document.getElementById('selectedCountries');
        this.notificationForm = document.getElementById('notificationForm');
        this.deviceOptions = document.querySelectorAll('.device-option');
    }

    initializeCountrySelector() {
        // Clear existing content
        this.countryList.innerHTML = '';
        
        // Sort countries by subscriber count
        const sortedCountries = [...countries].sort((a, b) => {
            const countA = this.subscriberCounts[a.code] || 0;
            const countB = this.subscriberCounts[b.code] || 0;
            return countB - countA; // Sort in descending order
        });
        
        // Create and append country options
        sortedCountries.forEach(country => {
            const option = document.createElement('div');
            option.className = 'country-option';
            const subscriberCount = this.subscriberCounts[country.code] || 0;
            
            option.innerHTML = `
                <img src="${country.flag}" alt="${country.name} flag" class="country-flag">
                <span class="country-name">${country.name}</span>
                <span class="subscriber-count">${subscriberCount} ${subscriberCount === 1 ? 'Subscriber' : 'Subscribers'}</span>
            `;
            
            option.addEventListener('click', () => {
                if (country.code === 'ALL') {
                    this.selectedCountries.clear();
                    this.selectedCountries.add('ALL');
                } else {
                    this.selectedCountries.delete('ALL');
                    if (this.selectedCountries.has(country.code)) {
                        this.selectedCountries.delete(country.code);
                    } else {
                        this.selectedCountries.add(country.code);
                    }
                }
                this.updateSelectedCountries();
                this.countrySearchInput.value = '';
                this.filterCountries('');
            });
            
            this.countryList.appendChild(option);
        });
    }

    updateSelectedCountries() {
        this.selectedCountriesContainer.innerHTML = '';
        
        const selectedCountriesArray = Array.from(this.selectedCountries);
        selectedCountriesArray.forEach(code => {
            const country = countries.find(c => c.code === code);
            if (country) {
                const subscriberCount = this.subscriberCounts[country.code] || 0;
                const tag = document.createElement('div');
                tag.className = 'selected-country';
                tag.innerHTML = `
                    <img src="${country.flag}" alt="${country.name} flag" class="country-flag">
                    <span class="country-name">${country.name}</span>
                    <span class="subscriber-count">${subscriberCount} ${subscriberCount === 1 ? 'Subscriber' : 'Subscribers'}</span>
                    <button type="button" class="remove-country">&times;</button>
                `;
                
                tag.querySelector('.remove-country').addEventListener('click', () => {
                    this.selectedCountries.delete(code);
                    this.updateSelectedCountries();
                });
                
                this.selectedCountriesContainer.appendChild(tag);
            }
        });
    }

    filterCountries(query) {
        const filteredCountries = countries.filter(country =>
            country.name.toLowerCase().includes(query.toLowerCase())
        );

        this.countryList.innerHTML = '';
        filteredCountries.forEach(country => {
            const option = document.createElement('div');
            option.className = 'country-option';
            const subscriberCount = this.subscriberCounts[country.code] || 0;
            
            option.innerHTML = `
                <img src="${country.flag}" alt="${country.name} flag" class="country-flag">
                <span class="country-name">${country.name}</span>
                <span class="subscriber-count">${subscriberCount} ${subscriberCount === 1 ? 'Subscriber' : 'Subscribers'}</span>
            `;
            
            option.addEventListener('click', () => {
                if (country.code === 'ALL') {
                    this.selectedCountries.clear();
                    this.selectedCountries.add('ALL');
                } else {
                    this.selectedCountries.delete('ALL');
                    if (this.selectedCountries.has(country.code)) {
                        this.selectedCountries.delete(country.code);
                    } else {
                        this.selectedCountries.add(country.code);
                    }
                }
                this.updateSelectedCountries();
                this.countrySearchInput.value = '';
                this.countryList.style.display = 'none';
            });
            
            this.countryList.appendChild(option);
        });
    }

    setupEventListeners() {
        // Country search and selection
        this.countrySearchInput.addEventListener('input', () => {
            this.filterCountries(this.countrySearchInput.value);
        });

        this.countrySearchInput.addEventListener('focus', () => {
            this.countryList.style.display = 'block';
            this.filterCountries(this.countrySearchInput.value);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.country-select-container')) {
                this.countryList.style.display = 'none';
            }
        });

        // Device selection
        this.deviceOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.handleDeviceSelection(option.dataset.device);
            });
        });

        // File uploads
        document.getElementById('notificationIcon').addEventListener('change', (e) => {
            this.handleFileUpload(e, 'icon');
        });

        document.getElementById('notificationImage').addEventListener('change', (e) => {
            this.handleFileUpload(e, 'image');
        });

        // Form submission
        this.notificationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.sendNotification();
        });

        // Live preview updates
        ['campaignName', 'notificationTitle', 'notificationMessage', 'ctaButtonText', 'clickAction'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.updatePreview());
        });
    }

    handleDeviceSelection(device) {
        this.selectedDevice = device;
        this.deviceOptions.forEach(option => {
            option.classList.toggle('selected', option.dataset.device === device);
        });
    }

    async handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size and dimensions
        const maxSize = 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            alert(`File size must be less than 1MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            event.target.value = '';
            return;
        }

        // Check image dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
            img.onload = () => {
                if (type === 'icon') {
                    if (img.width > 192 || img.height > 192) {
                        alert('Icon dimensions must not exceed 192x192 pixels');
                        event.target.value = '';
                        URL.revokeObjectURL(img.src);
                        return;
                    }
                }
                URL.revokeObjectURL(img.src);
                resolve();
            };
        });

        // Show progress bar
        const progressBar = document.getElementById(`${type}Progress`);
        progressBar.style.display = 'block';

        try {
            // Upload file
            const fileExt = file.name.split('.').pop();
            const fileName = `${type}_${Date.now()}.${fileExt}`;

            // Upload directly to storage
            const { data, error } = await this.supabase.storage
                .from('notifications')
                .upload(fileName, file, {
                    upsert: true,
                    contentType: file.type
                });

            if (error) {
                console.error('Upload error:', error);
                throw error;
            }

            // Get the public URL
            const { data: { publicUrl } } = this.supabase.storage
                .from('notifications')
                .getPublicUrl(fileName);

            // Update the image URL
            this.imageUrls[type] = publicUrl;

            // Update preview
            this.updatePreview();

            // Hide progress bar
            progressBar.style.display = 'none';
        } catch (error) {
            console.error('Upload error:', error);
            alert(`Error uploading ${type}: ${error.message || error}`);
            progressBar.style.display = 'none';
        }
    }

    updateUploadProgress(type, percent) {
        this.uploadProgress[type] = percent;
        const progressBar = document.getElementById(`${type}Progress`).querySelector('.progress-bar');
        progressBar.style.width = `${percent}%`;
    }

    updatePreview() {
        const title = document.getElementById('notificationTitle').value || 'Notification Title';
        const message = document.getElementById('notificationMessage').value || 'Notification message goes here...';
        const ctaText = document.getElementById('ctaButtonText').value || 'Click here';
        
        const previewTemplate = `
            <div class="notification">
                <div class="notification-header">
                    ${this.imageUrls.icon ? `<img src="${this.imageUrls.icon}" class="notification-icon" alt="Icon">` : ''}
                    <span class="notification-app-name">MANO MEDIA</span>
                    <span class="notification-time">now</span>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                    ${this.imageUrls.image ? `<img src="${this.imageUrls.image}" class="notification-image" alt="Notification image">` : ''}
                    <button class="notification-cta">${ctaText}</button>
                </div>
            </div>
        `;

        ['android', 'ios', 'chrome'].forEach(platform => {
            document.getElementById(`${platform}Preview`).innerHTML = previewTemplate;
        });
    }

    async sendNotification() {
        try {
            // Validate form data
            const campaignName = document.getElementById('campaignName').value;
            const title = document.getElementById('notificationTitle').value;
            const message = document.getElementById('notificationMessage').value;
            const ctaText = document.getElementById('ctaButtonText').value;
            const clickUrl = document.getElementById('clickAction').value;
            const scheduleTime = document.getElementById('scheduleTime').value;

            if (!campaignName || !title || !message || !ctaText || !clickUrl) {
                alert('Please fill in all required fields');
                return;
            }

            if (!this.selectedCountries.size) {
                alert('Please select at least one target country');
                return;
            }

            if (!this.imageUrls.icon) {
                alert('Please upload a notification icon');
                return;
            }

            // Validate click URL
            try {
                new URL(clickUrl);
            } catch (e) {
                alert('Please enter a valid URL for the click action');
                return;
            }

            // Prepare notification data according to schema
            const notificationData = {
                title: title,
                message: message,
                cta_text: ctaText,
                click_url: clickUrl,
                icon_url: this.imageUrls.icon,
                image_url: this.imageUrls.image,
                campaign_name: campaignName,
                target_countries: Array.from(this.selectedCountries),
                target_device: this.selectedDevice,
                schedule_time: scheduleTime || new Date().toISOString(),
                status: 'scheduled',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                sent_count: 0,
                click_count: 0,
                view_count: 0
            };

            console.log('Creating notification with data:', notificationData);

            // Insert notification data
            const { data: notification, error: notificationError } = await this.supabase
                .from('notifications')
                .insert([notificationData])
                .select();

            if (notificationError) throw notificationError;

            console.log('Notification created successfully:', notification);

            // Query subscribers based on targeting criteria
            let query = this.supabase
                .from('subscribers')
                .select('*')
                .eq('status', 'active');

            // Apply country targeting
            if (!this.selectedCountries.has('ALL')) {
                query = query.in('country', Array.from(this.selectedCountries));
            }

            // Apply device targeting
            if (this.selectedDevice !== 'all') {
                query = query.eq('device_type', this.selectedDevice);
            }

            const { data: subscribers, error: subscribersError } = await query;
            if (subscribersError) throw subscribersError;

            if (!subscribers || subscribers.length === 0) {
                alert('No matching subscribers found for the selected targeting criteria.');
                return;
            }

            console.log(`Found ${subscribers.length} matching subscribers`);

            // Send notifications through notification server
            const response = await fetch('http://localhost:3000/send-notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    campaignId: notification[0].id
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send notifications');
            }

            const result = await response.json();
            console.log('Notifications sent:', result);
            alert(`Notification campaign created! Sent to ${result.sent} devices (${result.failed} failed).`);
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert(`Error creating notification campaign: ${error.message}`);
        }
    }

    initializeSupabase() {
        try {
            console.log('Initializing Supabase...');
            this.supabase = window.supabase.createClient(
                config.supabase.url,
                config.supabase.serviceRole
            );
            console.log('Supabase initialized successfully');
            
            // Set up real-time subscription for campaigns
            this.setupRealtimeSubscription();
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.showError('Failed to initialize database connection');
        }
    }

    setupRealtimeSubscription() {
        const channel = this.supabase
            .channel('campaigns_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    console.log('Real-time campaign update received:', payload);
                    this.handleRealtimeUpdate(payload);
                }
            )
            .subscribe((status) => {
                console.log('Campaign subscription status:', status);
            });
    }

    handleRealtimeUpdate(payload) {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
            case 'INSERT':
                // Add new campaign to the list
                this.campaigns.unshift(this.formatCampaign(newRecord));
                break;
                
            case 'UPDATE':
                // Update existing campaign
                const index = this.campaigns.findIndex(c => c.id === newRecord.id);
                if (index !== -1) {
                    this.campaigns[index] = this.formatCampaign(newRecord);
                }
                break;
                
            case 'DELETE':
                // Remove deleted campaign
                const deleteIndex = this.campaigns.findIndex(c => c.id === oldRecord.id);
                if (deleteIndex !== -1) {
                    this.campaigns.splice(deleteIndex, 1);
                }
                break;
        }
        
        // Update UI
        this.updateCampaignList();
        this.updateStats();
    }

    formatCampaign(campaign) {
        return {
            id: campaign.id,
            title: campaign.title,
            message: campaign.message,
            url: campaign.click_url,
            image: campaign.image_url,
            status: campaign.status,
            scheduledFor: campaign.schedule_time,
            createdAt: campaign.created_at,
            sentCount: campaign.sent_count || 0,
            clickCount: campaign.click_count || 0,
            deliveryRate: campaign.delivery_rate || 0,
            clickRate: campaign.click_rate || 0
        };
    }
}

// Initialize NotificationManager when DOM is loaded
let notificationManager;
document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
});
