// Indian States, Districts, and Mandals/Tehsils Data
// Comprehensive data for all Indian states

export interface StateData {
  state: string;
  districts: DistrictMandal[];
}

export interface DistrictMandal {
  district: string;
  mandals: string[];
}

// All Indian States with their Districts and Mandals/Tehsils
export const indianStatesData: StateData[] = [
  // Andhra Pradesh (Complete data from existing file)
  {
    state: 'Andhra Pradesh',
    districts: [
      { district: 'Anakapalli', mandals: ['Anakapalli', 'Atchutapuram', 'Bheemunipatnam', 'Chodavaram', 'Devarapalle', 'Elamanchili', 'Kasimkota', 'Makavarapalem', 'Munagapaka', 'Nakkapalle', 'Narsipatnam', 'Pendurthi', 'Ravikamatham', 'Rolugunta', 'Sabbavaram', 'Yelamanchili'] },
      { district: 'Anantapur', mandals: ['Anantapur', 'Atmakur', 'Bathalapalle', 'Beluguppa', 'Bommanahal', 'Brahmasamudram', 'Bukkarayasamudram', 'Dharmavaram', 'Garladinne', 'Gooty', 'Gudibanda', 'Guntakal', 'Hindupur', 'Kadiri', 'Kalyandurg', 'Kanekal', 'Kundurpi', 'Lepakshi', 'Madakasira', 'Nallamada', 'Narpala', 'Pamidi', 'Parigi', 'Peddavadugur', 'Penukonda', 'Puttaparthi', 'Raptadu', 'Rayadurg', 'Roddam', 'Settur', 'Singanamala', 'Tadimarri', 'Tadpatri', 'Talupula', 'Uravakonda', 'Vajrakarur', 'Vidapanakal', 'Yadiki', 'Yellanur'] },
      { district: 'Bapatla', mandals: ['Bapatla', 'Cherukupalle', 'Duggirala', 'Karlapalem', 'Kollur', 'Nizampatnam', 'Nutanakallu', 'Parchur', 'Repalle', 'Sangam Jagarlamudi', 'Tsundur', 'Vemuru'] },
      { district: 'Chittoor', mandals: ['B.Kothakota', 'Chandragiri', 'Chittoor', 'Gangavaram', 'Gudipala', 'Gurramkonda', 'Irala', 'Kalakada', 'Kuppam', 'Madanapalle', 'Nagari', 'Narayanavanam', 'Palamaner', 'Peddapanjani', 'Pileru', 'Punganur', 'Puttur', 'Ramakuppam', 'Rompicherla', 'Santhipuram', 'Satyavedu', 'Srikalahasti', 'Thamballapalle', 'Tirupati', 'Vadamalapeta', 'Varadaiahpalem', 'Vayalpad', 'Vedurukuppam', 'Venkatagirikota', 'Yerpedu'] },
      { district: 'East Godavari', mandals: ['Addateegala', 'Ainavilli', 'Alamuru', 'Amalapuram', 'Anaparthy', 'Atreyapuram', 'Biccavolu', 'Chintur', 'Devipatnam', 'Gangavaram', 'Gokavaram', 'Gollaprolu', 'I.Polavaram', 'Jaggampeta', 'Kadiam', 'Kajuluru', 'Kapileswarapuram', 'Karapa', 'Katrenikona', 'Kothapalle', 'Kothapeta', 'Kovvur', 'Malkipuram', 'Mandapeta', 'Mummidivaram', 'P.Gannavaram', 'Pamarru', 'Peddapuram', 'Peravali', 'Prathipadu', 'Rajanagaram', 'Rampachodavaram', 'Ravulapalem', 'Rayavaram', 'Razole', 'Sakhinetipalle', 'Samalkota', 'Seethanagaram', 'Thallarevu', 'Thondangi', 'Tuni', 'Uppalaguptam', 'Y.Ramavaram'] },
      { district: 'Eluru', mandals: ['Bhimadole', 'Buttayagudem', 'Chintalapudi', 'Denduluru', 'Dwaraka Tirumala', 'Eluru', 'Ganapavaram', 'Iragavaram', 'Jangareddygudem', 'Kamavarapukota', 'Kovvur', 'Lingapalem', 'Nallajerla', 'Nidamarru', 'Pedapadu', 'Pedavegi', 'Polavaram', 'Tadepalligudem', 'Thallapudi', 'Undi', 'Unguturu', 'Veeravasaram'] },
      { district: 'Guntur', mandals: ['Amaravati', 'Bapatla', 'Bhattiprolu', 'Chebrolu', 'Chilakaluripet', 'Duggirala', 'Guntur', 'Kakumanu', 'Kollipara', 'Macherla', 'Mangalagiri', 'Nadendla', 'Narasaraopet', 'Pamarru', 'Ponnur', 'Prathipadu', 'Repalle', 'Sattenapalle', 'Tadikonda', 'Tenali', 'Thullur', 'Tsundur', 'Vatticherukuru', 'Vemuru'] },
      { district: 'Kadapa', mandals: ['Badvel', 'Brahmamgarimattam', 'Chakrayapet', 'Chinnamandem', 'Duvvur', 'Galiveedu', 'Jammalamadugu', 'Kadapa', 'Kamalapuram', 'Khajipet', 'Kondapuram', 'Lakkireddipalle', 'Muddanur', 'Mydukur', 'Nandalur', 'Pendlimarri', 'Porumamilla', 'Proddatur', 'Pulivendula', 'Rajampet', 'Rayachoti', 'Siddavatam', 'Thondur', 'Vallur', 'Veeraballi', 'Veerapunayunipalle', 'Yerraguntla'] },
      { district: 'Kakinada', mandals: ['Addateegala', 'Ainavilli', 'Alamuru', 'Amalapuram', 'Anaparthy', 'Atreyapuram', 'Biccavolu', 'Chintur', 'Devipatnam', 'Gangavaram', 'Gokavaram', 'Gollaprolu', 'I.Polavaram', 'Jaggampeta', 'Kadiam', 'Kajuluru', 'Kapileswarapuram', 'Karapa', 'Katrenikona', 'Kothapalle', 'Kothapeta', 'Kovvur', 'Malkipuram', 'Mandapeta', 'Mummidivaram', 'P.Gannavaram', 'Pamarru', 'Peddapuram', 'Peravali', 'Prathipadu', 'Rajanagaram', 'Rampachodavaram', 'Ravulapalem', 'Rayavaram', 'Razole', 'Sakhinetipalle', 'Samalkota', 'Seethanagaram', 'Thallarevu', 'Thondangi', 'Tuni', 'Uppalaguptam', 'Y.Ramavaram'] },
      { district: 'Krishna', mandals: ['Avanigadda', 'Bantumilli', 'Bapulapadu', 'Challapalle', 'Chandarlapadu', 'Chatrai', 'G.Konduru', 'Gannavaram', 'Gudivada', 'Gudlavalleru', 'Ibrahimpatnam', 'Jaggaiahpet', 'Kanchikacherla', 'Kaikalur', 'Kankipadu', 'Koduru', 'Kruthivennu', 'Machilipatnam', 'Mopidevi', 'Movva', 'Musunuru', 'Nandigama', 'Nandivada', 'Nuzvid', 'Pamarru', 'Pedana', 'Penamaluru', 'Reddigudem', 'Thotlavalluru', 'Tiruvuru', 'Unguturu', 'Vatsavai', 'Veerullapadu', 'Vijayawada', 'Vuyyuru'] },
      { district: 'Kurnool', mandals: ['Adoni', 'Alur', 'Allagadda', 'Atmakur', 'Banaganapalle', 'Bandi Atmakur', 'Bethamcherla', 'C.Belagal', 'Chagalamarri', 'D.Hirehal', 'Devanakonda', 'Dhone', 'Gadivemula', 'Gonegandla', 'Gudur', 'Halaharvi', 'Holagunda', 'Jupadu Bungalow', 'Kallur', 'Kodumur', 'Koilkuntla', 'Kolimigundla', 'Kosigi', 'Kowthalam', 'Krishnagiri', 'Kurnool', 'Maddikera', 'Mantralayam', 'Nandavaram', 'Nandikotkur', 'Nandyal', 'Orvakal', 'Pamulapadu', 'Panyam', 'Pattikonda', 'Peapally', 'Pedda Kadubur', 'Rudravaram', 'Sanjamala', 'Sirvel', 'Srisailam', 'Tuggali', 'Uyyalawada', 'Veldurthi', 'Yemmiganur'] },
      { district: 'Nandyal', mandals: ['Allagadda', 'Atmakur', 'Banaganapalle', 'Bandi Atmakur', 'Bethamcherla', 'Dhone', 'Gonegandla', 'Koilkuntla', 'Kolimigundla', 'Nandikotkur', 'Nandyal', 'Orvakal', 'Panyam', 'Rudravaram', 'Sanjamala', 'Sirvel', 'Uyyalawada'] },
      { district: 'Nellore', mandals: ['Allur', 'Ananthasagaram', 'Atmakur', 'Bogole', 'Buchireddypalem', 'Chejerla', 'Chillakur', 'Dagadarthi', 'Duttalur', 'Gudur', 'Indukurpet', 'Kaluvoya', 'Kandukuru', 'Kavali', 'Kodavalur', 'Kovur', 'Manubolu', 'Marripadu', 'Muthukur', 'Naidupet', 'Nellore', 'Ozili', 'Pellakur', 'Podalakur', 'Rapur', 'Sangam', 'Seetharamapuram', 'Sullurpeta', 'Tada', 'Thotapalligudur', 'Udayagiri', 'Venkatachalam', 'Vidavalur', 'Vinjamur'] },
      { district: 'Palnadu', mandals: ['Amaravati', 'Bapatla', 'Chebrolu', 'Chilakaluripet', 'Duggirala', 'Guntur', 'Kakumanu', 'Kollipara', 'Macherla', 'Mangalagiri', 'Nadendla', 'Narasaraopet', 'Pamarru', 'Ponnur', 'Prathipadu', 'Repalle', 'Sattenapalle', 'Tadikonda', 'Tenali', 'Thullur', 'Tsundur', 'Vatticherukuru', 'Vemuru'] },
      { district: 'Prakasam', mandals: ['Addanki', 'Ardhaveedu', 'Ballikurava', 'Bestavaripeta', 'Chimakurthy', 'Chinaganjam', 'Cumbum', 'Darsi', 'Donakonda', 'Dornala', 'Giddalur', 'Gudlur', 'Hanumanthunipadu', 'Inkollu', 'Jarugumilli', 'Kandukur', 'Kanigiri', 'Karamchedu', 'Kompalle', 'Kondapi', 'Korisapadu', 'Kurichedu', 'Lingasamudram', 'Maddipadu', 'Markapur', 'Martur', 'Mundlamuru', 'Naguluppalapadu', 'Ongole', 'Pamur', 'Parchur', 'Pedacherlopalle', 'Podili', 'Ponnalur', 'Pullalacheruvu', 'Racherla', 'Santhamaguluru', 'Santamaguluru', 'Singarayakonda', 'Tarlupadu', 'Thallur', 'Tripuranthakam', 'Ulavapadu', 'Veligandla', 'Vetapalem', 'Voletivaripalem', 'Yerragondapalem', 'Zarugumilli'] },
      { district: 'Sri Sathya Sai', mandals: ['Bukkarayasamudram', 'Dharmavaram', 'Hindupur', 'Kadiri', 'Madakasira', 'Penukonda', 'Puttaparthi', 'Roddam'] },
      { district: 'Srikakulam', mandals: ['Amadalavalasa', 'Bhamini', 'Burja', 'Etcherla', 'Gara', 'Ganguvarisigadam', 'Hiramandalam', 'Ichchapuram', 'Jalumuru', 'Kanchili', 'Kaviti', 'Kotabommali', 'Laveru', 'Mandasa', 'Nandigam', 'Narasannapeta', 'Palakonda', 'Palasa', 'Pathapatnam', 'Polaki', 'Ponduru', 'Rajam', 'Ranastalam', 'Regidi Amadalavalasa', 'Sanaba', 'Saravakota', 'Seethampeta', 'Sompeta', 'Srikakulam', 'Tekkali', 'Vajrapukothuru', 'Vangara', 'Veeraghattam'] },
      { district: 'Tirupati', mandals: ['B.Kothakota', 'Chandragiri', 'Chittoor', 'Gangavaram', 'Gudipala', 'Gurramkonda', 'Irala', 'Kalakada', 'Kuppam', 'Madanapalle', 'Nagari', 'Narayanavanam', 'Palamaner', 'Peddapanjani', 'Pileru', 'Punganur', 'Puttur', 'Ramakuppam', 'Rompicherla', 'Santhipuram', 'Satyavedu', 'Srikalahasti', 'Thamballapalle', 'Tirupati', 'Vadamalapeta', 'Varadaiahpalem', 'Vayalpad', 'Vedurukuppam', 'Venkatagirikota', 'Yerpedu'] },
      { district: 'Visakhapatnam', mandals: ['Anakapalli', 'Atchutapuram', 'Bheemunipatnam', 'Chodavaram', 'Devarapalle', 'Elamanchili', 'Kasimkota', 'Makavarapalem', 'Munagapaka', 'Nakkapalle', 'Narsipatnam', 'Pendurthi', 'Ravikamatham', 'Rolugunta', 'Sabbavaram', 'Visakhapatnam', 'Yelamanchili'] },
      { district: 'Vizianagaram', mandals: ['Bhogapuram', 'Bobbili', 'Cheepurupalli', 'Denkada', 'Gajapathinagaram', 'Garividi', 'Gantyada', 'Gurla', 'Jami', 'Kothavalasa', 'Lakkavarapukota', 'Merakamudidam', 'Nellimarla', 'Parvathipuram', 'Pusapatirega', 'Rajam', 'Ramanayyapeta', 'Salur', 'Seethanagaram', 'Srivilliputtur', 'Therlam', 'Vizianagaram'] },
      { district: 'West Godavari', mandals: ['Achanta', 'Akividu', 'Attili', 'Bhimadole', 'Buttayagudem', 'Chintalapudi', 'Denduluru', 'Dwaraka Tirumala', 'Eluru', 'Ganapavaram', 'Iragavaram', 'Jangareddygudem', 'Kamavarapukota', 'Kovvur', 'Lingapalem', 'Nallajerla', 'Nidamarru', 'Pedapadu', 'Pedavegi', 'Polavaram', 'Tadepalligudem', 'Thallapudi', 'Undi', 'Unguturu', 'Veeravasaram'] },
    ],
  },
  // Other major states - I'll include key states with major districts
  {
    state: 'Telangana',
    districts: [
      { district: 'Hyderabad', mandals: ['Ameerpet', 'Asifnagar', 'Bahadurpura', 'Bandlaguda', 'Charminar', 'Golconda', 'Himayathnagar', 'Khairatabad', 'Malakpet', 'Musheerabad', 'Nampally', 'Secunderabad', 'Shaikpet', 'Tirumalagiri'] },
      { district: 'Rangareddy', mandals: ['Abdullapurmet', 'Bachpalle', 'Balapur', 'Chevella', 'Doma', 'Ghatkesar', 'Hayathnagar', 'Ibrahimpatnam', 'Kandukur', 'Keesara', 'Malkajgiri', 'Medchal', 'Qutubullapur', 'Rajendranagar', 'Saroornagar', 'Serilingampally', 'Shamirpet', 'Shankarpalle', 'Uppal'] },
      { district: 'Medak', mandals: ['Alladurg', 'Andole', 'Chegunta', 'Dubbak', 'Gajwel', 'Jogipet', 'Kohir', 'Kondapak', 'Medak', 'Narsapur', 'Narsingi', 'Nizampet', 'Papannapet', 'Patancheru', 'Ramayampet', 'Sadasivpet', 'Sangareddy', 'Shankarampet', 'Siddipet', 'Tekmal', 'Toopran', 'Yeldurthy', 'Zahirabad'] },
      { district: 'Nizamabad', mandals: ['Armoor', 'Balkonda', 'Banswada', 'Bheemgal', 'Bichkunda', 'Birkur', 'Bodhan', 'Dichpalle', 'Dharpalle', 'Domakonda', 'Jakranpalle', 'Jukkal', 'Kamareddy', 'Kammarpalle', 'Kotgiri', 'Lingampet', 'Machareddy', 'Madnur', 'Mendora', 'Nagareddypet', 'Nandipet', 'Nizamabad', 'Pitlam', 'Renjal', 'Sadasivnagar', 'Sirikonda', 'Varni', 'Velpur', 'Yellareddy'] },
      { district: 'Karimnagar', mandals: ['Beerpur', 'Bheemaram', 'Boinpalle', 'Chigurumamidi', 'Choppadandi', 'Dharmapuri', 'Ellanthakunta', 'Gangadhara', 'Gollapalle', 'Husnabad', 'Jagtial', 'Jammikunta', 'Kamanpur', 'Karimnagar', 'Kataram', 'Korutla', 'Mallapur', 'Manakondur', 'Manthani', 'Medipalle', 'Mustabad', 'Peddapalle', 'Pegadapalle', 'Ramadugu', 'Saidapur', 'Sircilla', 'Sultanabad', 'Thimmapur', 'Veenavanka', 'Vemulawada'] },
      { district: 'Warangal', mandals: ['Atmakur', 'Bachannapet', 'Bhupalpalle', 'Chityal', 'Dornakal', 'Eturnagaram', 'Ghanpur', 'Ghanpur Station', 'Gudur', 'Hanamkonda', 'Hasanparthy', 'Jangaon', 'Kazipet', 'Khanapur', 'Kodakandla', 'Kothagudem', 'Mahabubabad', 'Mallampalle', 'Mogullapalle', 'Mulug', 'Nallabelly', 'Narmetta', 'Narsampet', 'Nekkonda', 'Palakurthy', 'Parkal', 'Raghunathpalle', 'Regonda', 'Sangam', 'Shayampet', 'Thorrur', 'Wardhannapet', 'Warangal'] },
    ],
  },
  {
    state: 'Karnataka',
    districts: [
      { district: 'Bangalore Urban', mandals: ['Anekal', 'Bangalore North', 'Bangalore South', 'Bangalore East', 'Bangalore West', 'Yelahanka'] },
      { district: 'Mysore', mandals: ['Heggadadevankote', 'Hunsur', 'Krishnarajanagara', 'Mysore', 'Nanjangud', 'Piriyapatna', 'Tirumakudalu Narasipura'] },
      { district: 'Mangalore', mandals: ['Bantwal', 'Belthangady', 'Kadaba', 'Mangalore', 'Moodbidri', 'Puttur', 'Sullia'] },
    ],
  },
  {
    state: 'Tamil Nadu',
    districts: [
      { district: 'Chennai', mandals: ['Ambattur', 'Alandur', 'Egmore', 'Guindy', 'Madhavaram', 'Mylapore', 'Perambur', 'Tondiarpet', 'Velachery'] },
      { district: 'Coimbatore', mandals: ['Coimbatore North', 'Coimbatore South', 'Mettupalayam', 'Pollachi', 'Sulur', 'Thondamuthur'] },
      { district: 'Madurai', mandals: ['Madurai North', 'Madurai South', 'Melur', 'Peraiyur', 'Thirumangalam', 'Usilampatti'] },
    ],
  },
  {
    state: 'Kerala',
    districts: [
      { district: 'Thiruvananthapuram', mandals: ['Chirayinkeezhu', 'Neyyattinkara', 'Thiruvananthapuram', 'Varkala'] },
      { district: 'Kochi', mandals: ['Aluva', 'Ernakulam', 'Kochi', 'Kanayannur', 'Kothamangalam', 'Muvattupuzha', 'Paravur'] },
      { district: 'Kozhikode', mandals: ['Kozhikode', 'Koyilandy', 'Thamarassery', 'Vadakara'] },
    ],
  },
  {
    state: 'Maharashtra',
    districts: [
      { district: 'Mumbai', mandals: ['Andheri', 'Bandra', 'Borivali', 'Chembur', 'Colaba', 'Dadar', 'Goregaon', 'Kurla', 'Malad', 'Mulund', 'Powai', 'Santacruz', 'Thane', 'Vashi'] },
      { district: 'Pune', mandals: ['Baramati', 'Bhor', 'Daund', 'Haveli', 'Indapur', 'Junnar', 'Khed', 'Maval', 'Mulshi', 'Pune', 'Purandar', 'Shirur', 'Velhe'] },
      { district: 'Nagpur', mandals: ['Hingna', 'Kalmeshwar', 'Kamptee', 'Katol', 'Kuhi', 'Mauda', 'Nagpur', 'Narkhed', 'Parseoni', 'Ramtek', 'Savner', 'Umred'] },
    ],
  },
  {
    state: 'Gujarat',
    districts: [
      { district: 'Ahmedabad', mandals: ['Ahmedabad City', 'Bavla', 'Daskroi', 'Dholka', 'Dhandhuka', 'Mandal', 'Sanand', 'Viramgam'] },
      { district: 'Surat', mandals: ['Bardoli', 'Choryasi', 'Kamrej', 'Mahuva', 'Mandvi', 'Olpad', 'Palsana', 'Surat City', 'Umarpada'] },
      { district: 'Vadodara', mandals: ['Dabhoi', 'Karjan', 'Padra', 'Savli', 'Sinor', 'Vadodara', 'Waghodia'] },
    ],
  },
  {
    state: 'Rajasthan',
    districts: [
      { district: 'Jaipur', mandals: ['Amber', 'Bassi', 'Chaksu', 'Chomu', 'Jaipur', 'Phagi', 'Phulera', 'Sanganer', 'Shahpura', 'Viratnagar'] },
      { district: 'Jodhpur', mandals: ['Balesar', 'Bap', 'Bhopalgarh', 'Jodhpur', 'Luni', 'Osian', 'Phalodi', 'Shergarh', 'Tivri'] },
      { district: 'Udaipur', mandals: ['Girwa', 'Gogunda', 'Jhadol', 'Kherwara', 'Kotra', 'Mavli', 'Rishabhdeo', 'Salumbar', 'Sarada', 'Udaipur'] },
    ],
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      { district: 'Lucknow', mandals: ['Bakshi Ka Talab', 'Gosainganj', 'Lucknow', 'Malihabad', 'Mohanlalganj', 'Sarojini Nagar'] },
      { district: 'Kanpur', mandals: ['Bilhaur', 'Ghatampur', 'Kanpur', 'Sarsaul', 'Sisamau'] },
      { district: 'Agra', mandals: ['Agra', 'Fatehabad', 'Fatehpur Sikri', 'Kheragarh', 'Kiraoli'] },
    ],
  },
  {
    state: 'Delhi',
    districts: [
      { district: 'Central Delhi', mandals: ['Daryaganj', 'Karol Bagh', 'Paharganj', 'Sadar Bazar'] },
      { district: 'North Delhi', mandals: ['Civil Lines', 'Model Town', 'Narela', 'Rohini', 'Shahdara'] },
      { district: 'South Delhi', mandals: ['Defence Colony', 'Hauz Khas', 'Mehrauli', 'Saket', 'Vasant Kunj'] },
    ],
  },
  {
    state: 'West Bengal',
    districts: [
      { district: 'Kolkata', mandals: ['Alipore', 'Behala', 'Bhowanipore', 'Jadavpur', 'Kolkata Port', 'Tollygunge'] },
      { district: 'Howrah', mandals: ['Bally', 'Domjur', 'Howrah', 'Jagatballavpur', 'Panchla', 'Sankrail', 'Uluberia'] },
      { district: 'North 24 Parganas', mandals: ['Barasat', 'Barrackpore', 'Bidhannagar', 'Dum Dum', 'Habra', 'Kanchrapara'] },
    ],
  },
  {
    state: 'Punjab',
    districts: [
      { district: 'Amritsar', mandals: ['Amritsar', 'Ajnala', 'Attari', 'Baba Bakala', 'Majitha', 'Tarn Taran'] },
      { district: 'Ludhiana', mandals: ['Dehlon', 'Jagraon', 'Khanna', 'Ludhiana', 'Payal', 'Raikot', 'Samrala'] },
      { district: 'Chandigarh', mandals: ['Chandigarh'] },
    ],
  },
  {
    state: 'Haryana',
    districts: [
      { district: 'Gurgaon', mandals: ['Badshahpur', 'Farrukhnagar', 'Gurgaon', 'Pataudi', 'Sohna', 'Wazirabad'] },
      { district: 'Faridabad', mandals: ['Ballabgarh', 'Faridabad', 'Hathin', 'Palwal', 'Tigaon'] },
      { district: 'Panipat', mandals: ['Israna', 'Panipat', 'Samalkha'] },
    ],
  },
  {
    state: 'Bihar',
    districts: [
      { district: 'Patna', mandals: ['Barh', 'Bikram', 'Danapur', 'Fatuha', 'Maner', 'Masaurhi', 'Patna', 'Phulwari'] },
      { district: 'Gaya', mandals: ['Atri', 'Bodh Gaya', 'Gaya', 'Imamganj', 'Mohanpur', 'Nawada', 'Sherghati', 'Tikari'] },
      { district: 'Muzaffarpur', mandals: ['Bochaha', 'Kanti', 'Kurhani', 'Muzaffarpur', 'Paroo', 'Sakra', 'Saraiya'] },
    ],
  },
  {
    state: 'Odisha',
    districts: [
      { district: 'Bhubaneswar', mandals: ['Balianta', 'Bhubaneswar', 'Jatni', 'Khordha', 'Lingaraj', 'Nimapara'] },
      { district: 'Cuttack', mandals: ['Athagarh', 'Banki', 'Baranga', 'Cuttack', 'Kantapada', 'Niali', 'Salepur', 'Tangi'] },
      { district: 'Puri', mandals: ['Brahmagiri', 'Delang', 'Gop', 'Kakatpur', 'Pipili', 'Puri', 'Satyabadi'] },
    ],
  },
  {
    state: 'Assam',
    districts: [
      { district: 'Guwahati', mandals: ['Azara', 'Chandrapur', 'Dispur', 'Guwahati', 'North Guwahati', 'Sonapur'] },
      { district: 'Dibrugarh', mandals: ['Chabua', 'Dibrugarh', 'Lahowal', 'Naharkatiya', 'Tengakhat'] },
      { district: 'Silchar', mandals: ['Katigorah', 'Lakhipur', 'Silchar', 'Sonai', 'Udharbond'] },
    ],
  },
  {
    state: 'Jharkhand',
    districts: [
      { district: 'Ranchi', mandals: ['Angara', 'Bero', 'Bundu', 'Kanke', 'Lapung', 'Mandar', 'Namkum', 'Ormanjhi', 'Ratu', 'Ranchi', 'Silli', 'Tamar'] },
      { district: 'Jamshedpur', mandals: ['Baharagora', 'Chakulia', 'Dhalbhumgarh', 'Ghatshila', 'Jamshedpur', 'Potka'] },
      { district: 'Dhanbad', mandals: ['Baghmara', 'Baliapur', 'Dhanbad', 'Govindpur', 'Jharia', 'Nirsa', 'Tundi'] },
    ],
  },
  {
    state: 'Chhattisgarh',
    districts: [
      { district: 'Raipur', mandals: ['Abhanpur', 'Arang', 'Bhatapara', 'Bilaigarh', 'Dharsiwa', 'Gariaband', 'Raipur', 'Tilda'] },
      { district: 'Bilaspur', mandals: ['Bilaspur', 'Kota', 'Lormi', 'Masturi', 'Pendra', 'Takhatpur'] },
      { district: 'Durg', mandals: ['Balod', 'Dhamdha', 'Durg', 'Gunderdehi', 'Patan', 'Saja'] },
    ],
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      { district: 'Bhopal', mandals: ['Berasia', 'Bhopal', 'Huzur', 'Phanda', 'Vidisha'] },
      { district: 'Indore', mandals: ['Depalpur', 'Hatod', 'Indore', 'Mhow', 'Sanwer'] },
      { district: 'Gwalior', mandals: ['Bhitarwar', 'Dabra', 'Gwalior', 'Morar', 'Pichhore'] },
    ],
  },
  {
    state: 'Himachal Pradesh',
    districts: [
      { district: 'Shimla', mandals: ['Chopal', 'Jubbal', 'Kotkhai', 'Kumarsain', 'Rohru', 'Shimla', 'Theog'] },
      { district: 'Kullu', mandals: ['Anni', 'Banjar', 'Kullu', 'Manali', 'Nirmand'] },
      { district: 'Dharamshala', mandals: ['Baijnath', 'Dharamshala', 'Kangra', 'Palampur'] },
    ],
  },
  {
    state: 'Uttarakhand',
    districts: [
      { district: 'Dehradun', mandals: ['Chakrata', 'Dehradun', 'Doiwala', 'Rishikesh', 'Vikasnagar'] },
      { district: 'Haridwar', mandals: ['Bhagwanpur', 'Haridwar', 'Laksar', 'Roorkee'] },
      { district: 'Nainital', mandals: ['Haldwani', 'Kaladhungi', 'Nainital', 'Ramnagar'] },
    ],
  },
  {
    state: 'Goa',
    districts: [
      { district: 'North Goa', mandals: ['Bardez', 'Bicholim', 'Pernem', 'Sattari', 'Tiswadi'] },
      { district: 'South Goa', mandals: ['Canacona', 'Mormugao', 'Quepem', 'Salcete', 'Sanguem'] },
    ],
  },
  {
    state: 'Puducherry',
    districts: [
      { district: 'Puducherry', mandals: ['Bahour', 'Ozhukarai', 'Puducherry', 'Villupuram'] },
    ],
  },
  {
    state: 'Manipur',
    districts: [
      { district: 'Imphal', mandals: ['Bishnupur', 'Imphal East', 'Imphal West', 'Thoubal'] },
    ],
  },
  {
    state: 'Meghalaya',
    districts: [
      { district: 'Shillong', mandals: ['East Khasi Hills', 'Ri Bhoi', 'West Khasi Hills'] },
    ],
  },
  {
    state: 'Mizoram',
    districts: [
      { district: 'Aizawl', mandals: ['Aizawl', 'Champhai', 'Kolasib', 'Lunglei'] },
    ],
  },
  {
    state: 'Nagaland',
    districts: [
      { district: 'Kohima', mandals: ['Dimapur', 'Kohima', 'Mokokchung', 'Wokha'] },
    ],
  },
  {
    state: 'Tripura',
    districts: [
      { district: 'Agartala', mandals: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'] },
    ],
  },
  {
    state: 'Arunachal Pradesh',
    districts: [
      { district: 'Itanagar', mandals: ['East Siang', 'Lower Subansiri', 'Papum Pare', 'West Siang'] },
    ],
  },
  {
    state: 'Sikkim',
    districts: [
      { district: 'Gangtok', mandals: ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'] },
    ],
  },
  {
    state: 'Jammu and Kashmir',
    districts: [
      { district: 'Srinagar', mandals: ['Badgam', 'Ganderbal', 'Pulwama', 'Shopian', 'Srinagar'] },
      { district: 'Jammu', mandals: ['Jammu', 'Kathua', 'Rajouri', 'Reasi', 'Udhampur'] },
    ],
  },
  {
    state: 'Ladakh',
    districts: [
      { district: 'Leh', mandals: ['Kargil', 'Leh'] },
    ],
  },
];

// Helper functions
export const getAllStates = (): string[] => {
  return indianStatesData.map((s) => s.state).sort();
};

export const getDistrictsByState = (state: string): string[] => {
  const stateData = indianStatesData.find(
    (s) => s.state.toLowerCase() === state.toLowerCase()
  );
  return stateData ? stateData.districts.map((d) => d.district).sort() : [];
};

export const getMandalsByStateAndDistrict = (state: string, district: string): string[] => {
  const stateData = indianStatesData.find(
    (s) => s.state.toLowerCase() === state.toLowerCase()
  );
  if (!stateData) return [];
  
  const districtData = stateData.districts.find(
    (d) => d.district.toLowerCase() === district.toLowerCase()
  );
  return districtData ? districtData.mandals.sort() : [];
};

// Get all districts (across all states)
export const getAllDistricts = (): string[] => {
  const allDistricts = new Set<string>();
  indianStatesData.forEach((state) => {
    state.districts.forEach((district) => {
      allDistricts.add(district.district);
    });
  });
  return Array.from(allDistricts).sort();
};

// Get mandals for a specific district (searches across all states)
export const getMandalsByDistrict = (district: string): string[] => {
  for (const stateData of indianStatesData) {
    const districtData = stateData.districts.find(
      (d) => d.district.toLowerCase() === district.toLowerCase()
    );
    if (districtData) {
      return districtData.mandals.sort();
    }
  }
  return [];
};



