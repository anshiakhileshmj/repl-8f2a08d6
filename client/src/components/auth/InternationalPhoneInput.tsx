import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
  placeholder: string;
  maxLength: number;
  format: string;
}

// Comprehensive country data with phone formats based on E.164 standard
const COUNTRIES: Country[] = [
  // Asia
  { code: "in", name: "India", dial_code: "+91", flag: "🇮🇳", placeholder: "9876543210", maxLength: 10, format: "+91 XXXXX XXXXX" },
  { code: "us", name: "United States", dial_code: "+1", flag: "🇺🇸", placeholder: "555-123-4567", maxLength: 10, format: "+1 XXX XXX XXXX" },
  { code: "gb", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧", placeholder: "7911 123456", maxLength: 11, format: "+44 XXXX XXXXXX" },
  { code: "ca", name: "Canada", dial_code: "+1", flag: "🇨🇦", placeholder: "555-123-4567", maxLength: 10, format: "+1 XXX XXX XXXX" },
  { code: "au", name: "Australia", dial_code: "+61", flag: "🇦🇺", placeholder: "4XX XXX XXX", maxLength: 9, format: "+61 XXX XXX XXX" },
  { code: "de", name: "Germany", dial_code: "+49", flag: "🇩🇪", placeholder: "171 12345678", maxLength: 11, format: "+49 XXX XXXXXXXX" },
  { code: "fr", name: "France", dial_code: "+33", flag: "🇫🇷", placeholder: "6 12 34 56 78", maxLength: 10, format: "+33 X XX XX XX XX" },
  { code: "it", name: "Italy", dial_code: "+39", flag: "🇮🇹", placeholder: "312 345 6789", maxLength: 10, format: "+39 XXX XXX XXXX" },
  { code: "es", name: "Spain", dial_code: "+34", flag: "🇪🇸", placeholder: "612 34 56 78", maxLength: 9, format: "+34 XXX XXX XXX" },
  { code: "jp", name: "Japan", dial_code: "+81", flag: "🇯🇵", placeholder: "90-1234-5678", maxLength: 11, format: "+81 XX XXXX XXXX" },
  { code: "kr", name: "South Korea", dial_code: "+82", flag: "🇰🇷", placeholder: "10-1234-5678", maxLength: 11, format: "+82 XX XXXX XXXX" },
  { code: "cn", name: "China", dial_code: "+86", flag: "🇨🇳", placeholder: "139 0013 0013", maxLength: 11, format: "+86 XXX XXXX XXXX" },
  { code: "br", name: "Brazil", dial_code: "+55", flag: "🇧🇷", placeholder: "11 91234-5678", maxLength: 11, format: "+55 XX 9XXXX XXXX" },
  { code: "mx", name: "Mexico", dial_code: "+52", flag: "🇲🇽", placeholder: "55 1234 5678", maxLength: 10, format: "+52 XX XXXX XXXX" },
  { code: "ru", name: "Russia", dial_code: "+7", flag: "🇷🇺", placeholder: "912 345-67-89", maxLength: 10, format: "+7 XXX XXX XXXX" },
  { code: "za", name: "South Africa", dial_code: "+27", flag: "🇿🇦", placeholder: "71 123 4567", maxLength: 9, format: "+27 XX XXX XXXX" },
  { code: "ae", name: "United Arab Emirates", dial_code: "+971", flag: "🇦🇪", placeholder: "50 123 4567", maxLength: 9, format: "+971 XX XXX XXXX" },
  { code: "sa", name: "Saudi Arabia", dial_code: "+966", flag: "🇸🇦", placeholder: "50 123 4567", maxLength: 9, format: "+966 XX XXX XXXX" },
  { code: "sg", name: "Singapore", dial_code: "+65", flag: "🇸🇬", placeholder: "8123 4567", maxLength: 8, format: "+65 XXXX XXXX" },
  { code: "ch", name: "Switzerland", dial_code: "+41", flag: "🇨🇭", placeholder: "78 123 45 67", maxLength: 9, format: "+41 XX XXX XX XX" },
  { code: "nl", name: "Netherlands", dial_code: "+31", flag: "🇳🇱", placeholder: "6 12345678", maxLength: 9, format: "+31 X XXXXXXXX" },
  { code: "se", name: "Sweden", dial_code: "+46", flag: "🇸🇪", placeholder: "70-123 45 67", maxLength: 9, format: "+46 XX XXX XX XX" },
  { code: "no", name: "Norway", dial_code: "+47", flag: "🇳🇴", placeholder: "406 12 345", maxLength: 8, format: "+47 XXX XX XXX" },
  { code: "dk", name: "Denmark", dial_code: "+45", flag: "🇩🇰", placeholder: "20 12 34 56", maxLength: 8, format: "+45 XX XX XX XX" },
  { code: "fi", name: "Finland", dial_code: "+358", flag: "🇫🇮", placeholder: "50 1234567", maxLength: 9, format: "+358 XX XXXXXXX" },
  { code: "be", name: "Belgium", dial_code: "+32", flag: "🇧🇪", placeholder: "470 12 34 56", maxLength: 9, format: "+32 XXX XX XX XX" },
  { code: "at", name: "Austria", dial_code: "+43", flag: "🇦🇹", placeholder: "664 123456", maxLength: 11, format: "+43 XXX XXXXXX" },
  { code: "pl", name: "Poland", dial_code: "+48", flag: "🇵🇱", placeholder: "512 123 456", maxLength: 9, format: "+48 XXX XXX XXX" },
  { code: "tr", name: "Turkey", dial_code: "+90", flag: "🇹🇷", placeholder: "501 234 56 78", maxLength: 10, format: "+90 XXX XXX XX XX" },
  { code: "eg", name: "Egypt", dial_code: "+20", flag: "🇪🇬", placeholder: "100 123 4567", maxLength: 10, format: "+20 XXX XXX XXXX" },
  { code: "ng", name: "Nigeria", dial_code: "+234", flag: "🇳🇬", placeholder: "802 123 4567", maxLength: 10, format: "+234 XXX XXX XXXX" },
  { code: "ke", name: "Kenya", dial_code: "+254", flag: "🇰🇪", placeholder: "712 123456", maxLength: 9, format: "+254 XXX XXXXXX" },
  { code: "gh", name: "Ghana", dial_code: "+233", flag: "🇬🇭", placeholder: "23 123 4567", maxLength: 9, format: "+233 XX XXX XXXX" },
  { code: "ma", name: "Morocco", dial_code: "+212", flag: "🇲🇦", placeholder: "6 12 34 56 78", maxLength: 9, format: "+212 X XX XX XX XX" },
  { code: "dz", name: "Algeria", dial_code: "+213", flag: "🇩🇿", placeholder: "551 23 45 67", maxLength: 9, format: "+213 XXX XX XX XX" },
  { code: "tn", name: "Tunisia", dial_code: "+216", flag: "🇹🇳", placeholder: "20 123 456", maxLength: 8, format: "+216 XX XXX XXX" },
  { code: "ly", name: "Libya", dial_code: "+218", flag: "🇱🇾", placeholder: "91 2345678", maxLength: 9, format: "+218 XX XXXXXXX" },
  { code: "et", name: "Ethiopia", dial_code: "+251", flag: "🇪🇹", placeholder: "91 123 4567", maxLength: 9, format: "+251 XX XXX XXXX" },
  { code: "tz", name: "Tanzania", dial_code: "+255", flag: "🇹🇿", placeholder: "621 123 456", maxLength: 9, format: "+255 XXX XXX XXX" },
  { code: "ug", name: "Uganda", dial_code: "+256", flag: "🇺🇬", placeholder: "701 123456", maxLength: 9, format: "+256 XXX XXXXXX" },
  { code: "mz", name: "Mozambique", dial_code: "+258", flag: "🇲🇿", placeholder: "82 123 4567", maxLength: 9, format: "+258 XX XXX XXXX" },
  { code: "zm", name: "Zambia", dial_code: "+260", flag: "🇿🇲", placeholder: "95 1234567", maxLength: 9, format: "+260 XX XXXXXXX" },
  { code: "zw", name: "Zimbabwe", dial_code: "+263", flag: "🇿🇼", placeholder: "71 123 4567", maxLength: 9, format: "+263 XX XXX XXXX" },
  { code: "bw", name: "Botswana", dial_code: "+267", flag: "🇧🇼", placeholder: "71 123 456", maxLength: 8, format: "+267 XX XXX XXX" },
  { code: "sz", name: "Eswatini", dial_code: "+268", flag: "🇸🇿", placeholder: "76 12 34 56", maxLength: 8, format: "+268 XX XX XX XX" },
  { code: "ls", name: "Lesotho", dial_code: "+266", flag: "🇱🇸", placeholder: "50 12 34 56", maxLength: 8, format: "+266 XX XX XX XX" },
  // Additional countries
  { code: "af", name: "Afghanistan", dial_code: "+93", flag: "🇦🇫", placeholder: "70 123 4567", maxLength: 9, format: "+93 XX XXX XXXX" },
  { code: "al", name: "Albania", dial_code: "+355", flag: "🇦🇱", placeholder: "67 212 3456", maxLength: 9, format: "+355 XX XXX XXXX" },
  { code: "ar", name: "Argentina", dial_code: "+54", flag: "🇦🇷", placeholder: "9 11 2345-6789", maxLength: 10, format: "+54 9 XX XXXX XXXX" },
  { code: "am", name: "Armenia", dial_code: "+374", flag: "🇦🇲", placeholder: "77 123456", maxLength: 8, format: "+374 XX XXXXXX" },
  { code: "bd", name: "Bangladesh", dial_code: "+880", flag: "🇧🇩", placeholder: "171 234 5678", maxLength: 10, format: "+880 XXX XXX XXXX" },
  { code: "by", name: "Belarus", dial_code: "+375", flag: "🇧🇾", placeholder: "29 1234567", maxLength: 9, format: "+375 XX XXXXXXX" },
  { code: "bg", name: "Bulgaria", dial_code: "+359", flag: "🇧🇬", placeholder: "87 123 4567", maxLength: 9, format: "+359 XX XXX XXXX" },
  { code: "kh", name: "Cambodia", dial_code: "+855", flag: "🇰🇭", placeholder: "91 234 567", maxLength: 8, format: "+855 XX XXX XXX" },
  { code: "cl", name: "Chile", dial_code: "+56", flag: "🇨🇱", placeholder: "9 1234 5678", maxLength: 9, format: "+56 9 XXXX XXXX" },
  { code: "co", name: "Colombia", dial_code: "+57", flag: "🇨🇴", placeholder: "300 1234567", maxLength: 10, format: "+57 XXX XXXXXXX" },
  { code: "hr", name: "Croatia", dial_code: "+385", flag: "🇭🇷", placeholder: "91 234 5678", maxLength: 9, format: "+385 XX XXX XXXX" },
  { code: "cz", name: "Czech Republic", dial_code: "+420", flag: "🇨🇿", placeholder: "601 123 456", maxLength: 9, format: "+420 XXX XXX XXX" },
  { code: "ec", name: "Ecuador", dial_code: "+593", flag: "🇪🇨", placeholder: "99 123 4567", maxLength: 9, format: "+593 XX XXX XXXX" },
  { code: "ee", name: "Estonia", dial_code: "+372", flag: "🇪🇪", placeholder: "512 3456", maxLength: 8, format: "+372 XXXX XXXX" },
  { code: "ge", name: "Georgia", dial_code: "+995", flag: "🇬🇪", placeholder: "555 12 34 56", maxLength: 9, format: "+995 XXX XX XX XX" },
  { code: "gr", name: "Greece", dial_code: "+30", flag: "🇬🇷", placeholder: "691 234 5678", maxLength: 10, format: "+30 XXX XXX XXXX" },
  { code: "gt", name: "Guatemala", dial_code: "+502", flag: "🇬🇹", placeholder: "5123 4567", maxLength: 8, format: "+502 XXXX XXXX" },
  { code: "hn", name: "Honduras", dial_code: "+504", flag: "🇭🇳", placeholder: "9123 4567", maxLength: 8, format: "+504 XXXX XXXX" },
  { code: "hk", name: "Hong Kong", dial_code: "+852", flag: "🇭🇰", placeholder: "5123 4567", maxLength: 8, format: "+852 XXXX XXXX" },
  { code: "hu", name: "Hungary", dial_code: "+36", flag: "🇭🇺", placeholder: "20 123 4567", maxLength: 9, format: "+36 XX XXX XXXX" },
  { code: "is", name: "Iceland", dial_code: "+354", flag: "🇮🇸", placeholder: "611 2345", maxLength: 7, format: "+354 XXX XXXX" },
  { code: "id", name: "Indonesia", dial_code: "+62", flag: "🇮🇩", placeholder: "812-3456-7890", maxLength: 11, format: "+62 XXX XXXX XXXX" },
  { code: "ir", name: "Iran", dial_code: "+98", flag: "🇮🇷", placeholder: "901 234 5678", maxLength: 10, format: "+98 XXX XXX XXXX" },
  { code: "iq", name: "Iraq", dial_code: "+964", flag: "🇮🇶", placeholder: "790 123 4567", maxLength: 10, format: "+964 XXX XXX XXXX" },
  { code: "ie", name: "Ireland", dial_code: "+353", flag: "🇮🇪", placeholder: "85 012 3456", maxLength: 9, format: "+353 XX XXX XXXX" },
  { code: "il", name: "Israel", dial_code: "+972", flag: "🇮🇱", placeholder: "50-123-4567", maxLength: 9, format: "+972 XX XXX XXXX" },
  { code: "jm", name: "Jamaica", dial_code: "+1", flag: "🇯🇲", placeholder: "876-123-4567", maxLength: 10, format: "+1 XXX XXX XXXX" },
  { code: "jo", name: "Jordan", dial_code: "+962", flag: "🇯🇴", placeholder: "7 9012 3456", maxLength: 9, format: "+962 X XXXX XXXX" },
  { code: "kz", name: "Kazakhstan", dial_code: "+7", flag: "🇰🇿", placeholder: "701 123 45 67", maxLength: 10, format: "+7 XXX XXX XX XX" },
  { code: "kw", name: "Kuwait", dial_code: "+965", flag: "🇰🇼", placeholder: "500 12345", maxLength: 8, format: "+965 XXXX XXXX" },
  { code: "kg", name: "Kyrgyzstan", dial_code: "+996", flag: "🇰🇬", placeholder: "700 123 456", maxLength: 9, format: "+996 XXX XXX XXX" },
  { code: "la", name: "Laos", dial_code: "+856", flag: "🇱🇦", placeholder: "20 1234 5678", maxLength: 10, format: "+856 XX XXXX XXXX" },
  { code: "lv", name: "Latvia", dial_code: "+371", flag: "🇱🇻", placeholder: "2123 4567", maxLength: 8, format: "+371 XXXX XXXX" },
  { code: "lb", name: "Lebanon", dial_code: "+961", flag: "🇱🇧", placeholder: "71 123 456", maxLength: 8, format: "+961 XX XXX XXX" },
  { code: "lt", name: "Lithuania", dial_code: "+370", flag: "🇱🇹", placeholder: "612 34567", maxLength: 8, format: "+370 XXX XXXXX" },
  { code: "lu", name: "Luxembourg", dial_code: "+352", flag: "🇱🇺", placeholder: "628 123 456", maxLength: 9, format: "+352 XXX XXX XXX" },
  { code: "mo", name: "Macau", dial_code: "+853", flag: "🇲🇴", placeholder: "6612 3456", maxLength: 8, format: "+853 XXXX XXXX" },
  { code: "mk", name: "North Macedonia", dial_code: "+389", flag: "🇲🇰", placeholder: "70 123 456", maxLength: 8, format: "+389 XX XXX XXX" },
  { code: "my", name: "Malaysia", dial_code: "+60", flag: "🇲🇾", placeholder: "12-345 6789", maxLength: 9, format: "+60 XX XXX XXXX" },
  { code: "mv", name: "Maldives", dial_code: "+960", flag: "🇲🇻", placeholder: "771 2345", maxLength: 7, format: "+960 XXX XXXX" },
  { code: "ml", name: "Mali", dial_code: "+223", flag: "🇲🇱", placeholder: "65 01 23 45", maxLength: 8, format: "+223 XX XX XX XX" },
  { code: "mt", name: "Malta", dial_code: "+356", flag: "🇲🇹", placeholder: "9696 1234", maxLength: 8, format: "+356 XXXX XXXX" },
  { code: "mr", name: "Mauritania", dial_code: "+222", flag: "🇲🇷", placeholder: "22 12 34 56", maxLength: 8, format: "+222 XX XX XX XX" },
  { code: "mu", name: "Mauritius", dial_code: "+230", flag: "🇲🇺", placeholder: "5251 2345", maxLength: 8, format: "+230 XXXX XXXX" },
  { code: "md", name: "Moldova", dial_code: "+373", flag: "🇲🇩", placeholder: "621 12 345", maxLength: 8, format: "+373 XXX XX XXX" },
  { code: "mc", name: "Monaco", dial_code: "+377", flag: "🇲🇨", placeholder: "6 12 34 56 78", maxLength: 9, format: "+377 X XX XX XX XX" },
  { code: "mn", name: "Mongolia", dial_code: "+976", flag: "🇲🇳", placeholder: "8812 3456", maxLength: 8, format: "+976 XXXX XXXX" },
  { code: "me", name: "Montenegro", dial_code: "+382", flag: "🇲🇪", placeholder: "67 622 901", maxLength: 8, format: "+382 XX XXX XXX" },
  { code: "mm", name: "Myanmar", dial_code: "+95", flag: "🇲🇲", placeholder: "9 212 3456", maxLength: 9, format: "+95 X XXX XXXX" },
  { code: "na", name: "Namibia", dial_code: "+264", flag: "🇳🇦", placeholder: "81 123 4567", maxLength: 9, format: "+264 XX XXX XXXX" },
  { code: "np", name: "Nepal", dial_code: "+977", flag: "🇳🇵", placeholder: "984-1234567", maxLength: 10, format: "+977 XXX XXXXXXX" },
  { code: "nz", name: "New Zealand", dial_code: "+64", flag: "🇳🇿", placeholder: "21 123 4567", maxLength: 9, format: "+64 XX XXX XXXX" },
  { code: "ni", name: "Nicaragua", dial_code: "+505", flag: "🇳🇮", placeholder: "8123 4567", maxLength: 8, format: "+505 XXXX XXXX" },
  { code: "ne", name: "Niger", dial_code: "+227", flag: "🇳🇪", placeholder: "93 12 34 56", maxLength: 8, format: "+227 XX XX XX XX" },
  { code: "kp", name: "North Korea", dial_code: "+850", flag: "🇰🇵", placeholder: "192 123 4567", maxLength: 10, format: "+850 XXX XXX XXXX" },
  { code: "om", name: "Oman", dial_code: "+968", flag: "🇴🇲", placeholder: "9212 3456", maxLength: 8, format: "+968 XXXX XXXX" },
  { code: "pk", name: "Pakistan", dial_code: "+92", flag: "🇵🇰", placeholder: "301 2345678", maxLength: 10, format: "+92 XXX XXXXXXX" },
  { code: "pw", name: "Palau", dial_code: "+680", flag: "🇵🇼", placeholder: "620 1234", maxLength: 7, format: "+680 XXX XXXX" },
  { code: "ps", name: "Palestine", dial_code: "+970", flag: "🇵🇸", placeholder: "59 123 4567", maxLength: 9, format: "+970 XX XXX XXXX" },
  { code: "pa", name: "Panama", dial_code: "+507", flag: "🇵🇦", placeholder: "6123-4567", maxLength: 8, format: "+507 XXXX XXXX" },
  { code: "pg", name: "Papua New Guinea", dial_code: "+675", flag: "🇵🇬", placeholder: "681 23456", maxLength: 8, format: "+675 XXX XXXXX" },
  { code: "py", name: "Paraguay", dial_code: "+595", flag: "🇵🇾", placeholder: "961 123456", maxLength: 9, format: "+595 XXX XXXXXX" },
  { code: "pe", name: "Peru", dial_code: "+51", flag: "🇵🇪", placeholder: "912 345 678", maxLength: 9, format: "+51 XXX XXX XXX" },
  { code: "ph", name: "Philippines", dial_code: "+63", flag: "🇵🇭", placeholder: "917 123 4567", maxLength: 10, format: "+63 XXX XXX XXXX" },
  { code: "pt", name: "Portugal", dial_code: "+351", flag: "🇵🇹", placeholder: "912 345 678", maxLength: 9, format: "+351 XXX XXX XXX" },
  { code: "pr", name: "Puerto Rico", dial_code: "+1", flag: "🇵🇷", placeholder: "787-123-4567", maxLength: 10, format: "+1 XXX XXX XXXX" },
  { code: "qa", name: "Qatar", dial_code: "+974", flag: "🇶🇦", placeholder: "3312 3456", maxLength: 8, format: "+974 XXXX XXXX" },
  { code: "ro", name: "Romania", dial_code: "+40", flag: "🇷🇴", placeholder: "712 034 567", maxLength: 9, format: "+40 XXX XXX XXX" },
  { code: "rw", name: "Rwanda", dial_code: "+250", flag: "🇷🇼", placeholder: "781 123 456", maxLength: 9, format: "+250 XXX XXX XXX" },
  { code: "rs", name: "Serbia", dial_code: "+381", flag: "🇷🇸", placeholder: "60 1234567", maxLength: 9, format: "+381 XX XXXXXXX" },
  { code: "sc", name: "Seychelles", dial_code: "+248", flag: "🇸🇨", placeholder: "251 2345", maxLength: 7, format: "+248 XXX XXXX" },
  { code: "sl", name: "Sierra Leone", dial_code: "+232", flag: "🇸🇱", placeholder: "25 123456", maxLength: 8, format: "+232 XX XXXXXX" },
  { code: "sk", name: "Slovakia", dial_code: "+421", flag: "🇸🇰", placeholder: "912 123 456", maxLength: 9, format: "+421 XXX XXX XXX" },
  { code: "si", name: "Slovenia", dial_code: "+386", flag: "🇸🇮", placeholder: "31 123 456", maxLength: 8, format: "+386 XX XXX XXX" },
  { code: "sb", name: "Solomon Islands", dial_code: "+677", flag: "🇸🇧", placeholder: "74 12345", maxLength: 7, format: "+677 XX XXXXX" },
  { code: "so", name: "Somalia", dial_code: "+252", flag: "🇸🇴", placeholder: "90 1234567", maxLength: 9, format: "+252 XX XXXXXXX" },
  { code: "lk", name: "Sri Lanka", dial_code: "+94", flag: "🇱🇰", placeholder: "71 234 5678", maxLength: 9, format: "+94 XX XXX XXXX" },
  { code: "sd", name: "Sudan", dial_code: "+249", flag: "🇸🇩", placeholder: "91 123 4567", maxLength: 9, format: "+249 XX XXX XXXX" },
  { code: "sr", name: "Suriname", dial_code: "+597", flag: "🇸🇷", placeholder: "612 3456", maxLength: 7, format: "+597 XXX XXXX" },
  { code: "sy", name: "Syria", dial_code: "+963", flag: "🇸🇾", placeholder: "944 123 456", maxLength: 9, format: "+963 XXX XXX XXX" },
  { code: "tw", name: "Taiwan", dial_code: "+886", flag: "🇹🇼", placeholder: "912 345 678", maxLength: 9, format: "+886 XXX XXX XXX" },
  { code: "tj", name: "Tajikistan", dial_code: "+992", flag: "🇹🇯", placeholder: "917 12 3456", maxLength: 9, format: "+992 XXX XX XXXX" },
  { code: "th", name: "Thailand", dial_code: "+66", flag: "🇹🇭", placeholder: "81 234 5678", maxLength: 9, format: "+66 XX XXX XXXX" },
  { code: "tl", name: "Timor-Leste", dial_code: "+670", flag: "🇹🇱", placeholder: "7721 2345", maxLength: 8, format: "+670 XXXX XXXX" },
  { code: "tg", name: "Togo", dial_code: "+228", flag: "🇹🇬", placeholder: "90 12 34 56", maxLength: 8, format: "+228 XX XX XX XX" },
  { code: "to", name: "Tonga", dial_code: "+676", flag: "🇹🇴", placeholder: "771 2345", maxLength: 7, format: "+676 XXX XXXX" },
  { code: "tt", name: "Trinidad and Tobago", dial_code: "+1", flag: "🇹🇹", placeholder: "868-123-4567", maxLength: 10, format: "+1 XXX XXX XXXX" },
  { code: "tm", name: "Turkmenistan", dial_code: "+993", flag: "🇹🇲", placeholder: "65 123456", maxLength: 8, format: "+993 XX XXXXXX" },
  { code: "tv", name: "Tuvalu", dial_code: "+688", flag: "🇹🇻", placeholder: "901234", maxLength: 6, format: "+688 XXXXXX" },
  { code: "ua", name: "Ukraine", dial_code: "+380", flag: "🇺🇦", placeholder: "50 123 4567", maxLength: 9, format: "+380 XX XXX XXXX" },
  { code: "uy", name: "Uruguay", dial_code: "+598", flag: "🇺🇾", placeholder: "94 123 456", maxLength: 8, format: "+598 XX XXX XXX" },
  { code: "uz", name: "Uzbekistan", dial_code: "+998", flag: "🇺🇿", placeholder: "90 123 45 67", maxLength: 9, format: "+998 XX XXX XX XX" },
  { code: "vu", name: "Vanuatu", dial_code: "+678", flag: "🇻🇺", placeholder: "591 2345", maxLength: 7, format: "+678 XXX XXXX" },
  { code: "ve", name: "Venezuela", dial_code: "+58", flag: "🇻🇪", placeholder: "414-1234567", maxLength: 10, format: "+58 XXX XXXXXXX" },
  { code: "vn", name: "Vietnam", dial_code: "+84", flag: "🇻🇳", placeholder: "91 234 56 78", maxLength: 9, format: "+84 XX XXX XX XX" },
  { code: "ye", name: "Yemen", dial_code: "+967", flag: "🇾🇪", placeholder: "712 345 678", maxLength: 9, format: "+967 XXX XXX XXX" },
];

interface InternationalPhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean, formattedNumber: string) => void;
  required?: boolean;
}

export const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
  value,
  onChange,
  required = false,
}) => {
  // Find India as default country
  const defaultCountry = COUNTRIES.find(c => c.code === 'in') || COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const validatePhoneNumber = (number: string, country: Country): boolean => {
    // Remove any non-digit characters for validation
    const cleaned = number.replace(/\D/g, '');
    // Basic validation: should match expected length for the country
    return cleaned.length >= (country.maxLength - 2) && cleaned.length <= country.maxLength;
  };

  const formatPhoneNumber = (number: string, country: Country): string => {
    const cleaned = number.replace(/\D/g, '');
    return `${country.dial_code} ${cleaned}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove any non-digit characters except spaces and common phone formatting
    inputValue = inputValue.replace(/[^\d\s\-\(\)\+]/g, '');
    
    // Limit length based on selected country
    if (inputValue.replace(/\D/g, '').length > selectedCountry.maxLength) {
      inputValue = inputValue.substring(0, selectedCountry.maxLength + 3); // Allow for formatting chars
    }

    setPhoneNumber(inputValue);
    
    const isValid = validatePhoneNumber(inputValue, selectedCountry);
    const formattedNumber = formatPhoneNumber(inputValue, selectedCountry);
    
    onChange(formattedNumber, isValid, formattedNumber);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Re-validate with new country
    const isValid = validatePhoneNumber(phoneNumber, country);
    const formattedNumber = formatPhoneNumber(phoneNumber, country);
    onChange(formattedNumber, isValid, formattedNumber);
  };

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dial_code.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="phone-input-wrapper">
      <div className="phone-input-container">
        {/* Country Selector */}
        <div 
          ref={dropdownRef}
          className="country-selector"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          data-testid="country-selector"
        >
          <span className="country-flag">{selectedCountry.flag}</span>
          <span className="country-code">{selectedCountry.dial_code}</span>
          <ChevronDown className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
          
          {isDropdownOpen && (
            <div className="country-dropdown">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="country-search"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="country-search"
                />
              </div>
              <div className="country-list">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCountrySelect(country);
                    }}
                    data-testid={`country-option-${country.code}`}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.name}</span>
                    <span className="country-code">{country.dial_code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={selectedCountry.placeholder}
          className="phone-number-input auth-input"
          required={required}
          data-testid="input-phone-number"
        />
      </div>
    </div>
  );
};