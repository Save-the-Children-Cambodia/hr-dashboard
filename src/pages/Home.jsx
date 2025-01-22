import React, { useState } from "react";
import Member1 from "../components/Panhathun";
import Attendance from "../components/Elliot";
import EditProject from "../components/EditProject";
import EditPerson from "../components/EditPerson";
import "../styles/home.css"

const Home = () => {
  const [activeComponent, setActiveComponent] = useState('employees');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'employees':
        return <Member1 />;
      case 'attendance':
        return <Attendance />;
      case 'edit-project':
        return <EditProject />;
      case 'edit-person':
        return <EditPerson />;
      default:
        return <Member1 />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <span className="text-xl  font-semibold text-gray-800">HR Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = '.json,.csv';
                  fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    console.log('Importing file:', file);
                  };
                  fileInput.click();
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-sm bg-custom-purple-500 shadow-sm hover:bg-custom-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#FFFFFF" stroke="none">
<path d="M1160 4622 c-125 -33 -235 -121 -298 -240 l-33 -62 1730 0 c1378 0
1731 3 1731 13 0 26 -63 119 -115 170 -60 59 -152 109 -233 126 -37 8 -452 11
-1385 10 -1220 0 -1337 -2 -1397 -17z"/>
<path d="M545 3988 c-169 -32 -319 -174 -366 -346 -18 -63 -19 -132 -19 -1400
0 -1462 -2 -1411 59 -1517 62 -107 145 -178 266 -226 l60 -24 1988 -3 c1757
-2 1995 -1 2054 13 185 43 329 188 368 372 22 101 22 2655 0 2756 -35 165
-151 298 -314 361 l-56 21 -1995 1 c-1238 1 -2014 -2 -2045 -8z m2113 -662
c21 -14 187 -175 369 -358 358 -360 353 -353 340 -448 -6 -50 -33 -85 -83
-110 -49 -24 -94 -26 -137 -4 -18 9 -121 104 -229 212 l-198 197 0 -795 c0
-770 -1 -796 -20 -827 -72 -119 -255 -92 -289 41 -8 31 -11 280 -11 813 l0
768 -176 -183 c-97 -100 -195 -193 -218 -207 -130 -76 -278 37 -236 178 10 35
66 97 348 381 217 217 351 345 377 357 52 25 113 20 163 -15z"/>
</g>
                </svg>
                <span className="text-white pl-2">Import Team Data</span>
              </button>
              <button 
                onClick={() => {
                  const data = { /* your team data here */ };
                  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'team-data.json';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-300 border border-gray-300 rounded-md font-semibold text-sm text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M1160 4622 c-125 -33 -235 -121 -298 -240 l-33 -62 1730 0 c1378 0
1731 3 1731 13 0 26 -63 119 -115 170 -60 59 -152 109 -233 126 -37 8 -452 11
-1385 10 -1220 0 -1337 -2 -1397 -17z"/>
<path d="M545 3988 c-169 -32 -319 -174 -366 -346 -18 -63 -19 -132 -19 -1400
0 -1462 -2 -1411 59 -1517 62 -107 145 -178 266 -226 l60 -24 1988 -3 c1757
-2 1995 -1 2054 13 185 43 329 188 368 372 22 101 22 2655 0 2756 -35 165
-151 298 -314 361 l-56 21 -1995 1 c-1238 1 -2014 -2 -2045 -8z m2089 -648
c23 -11 50 -33 61 -48 20 -26 20 -45 23 -824 1 -439 6 -798 10 -798 4 0 93 86
197 191 105 105 202 197 217 205 15 8 49 14 75 14 90 0 153 -63 153 -153 0
-26 -6 -60 -14 -75 -18 -34 -692 -705 -725 -722 -33 -17 -101 -16 -136 3 -17
8 -186 172 -377 364 -305 306 -347 353 -354 386 -21 117 90 220 201 187 32
-10 79 -51 237 -208 l198 -196 2 790 3 789 23 37 c25 40 91 78 136 78 16 0 48
-9 70 -20z"/>
</g>
                </svg>
                <span className="text-black pl-2">Export Team Data</span>
              </button>
              <button 
                onClick={() => setActiveComponent('settings')} 
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Left Toolbar/Sidebar */}
        <div className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)]">
          <div className="p-4">
            <ul className="space-y-2">
              {/* Members Section */}
              <span className="text-gray-600 text-left block mt-4">Members</span>
              <li className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center  text-gray-700 w-full"
                >
                    <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#606163" stroke="none">
<path d="M703 4461 c-229 -56 -410 -235 -470 -464 -21 -81 -21 -233 0 -314 87
-331 419 -538 752 -468 233 49 435 245 489 475 9 36 16 103 16 150 0 179 -58
318 -185 446 -63 64 -98 90 -165 123 -144 70 -291 88 -437 52z"/>
<path d="M2405 4466 c-144 -29 -264 -84 -376 -174 -345 -273 -422 -764 -180
-1135 75 -114 199 -224 322 -286 142 -71 233 -93 384 -94 234 0 422 74 587
231 135 129 218 278 253 451 23 112 16 294 -15 401 -48 166 -165 340 -298 441
-80 61 -223 131 -312 154 -90 22 -277 28 -365 11z"/>
<path d="M4130 4464 c-229 -49 -431 -246 -484 -474 -9 -36 -16 -103 -16 -150
0 -179 58 -318 185 -446 92 -93 201 -154 320 -179 333 -70 662 135 751 466 22
83 23 234 1 316 -88 333 -421 540 -757 467z"/>
<path d="M555 2980 c-247 -39 -445 -204 -522 -435 -26 -78 -27 -87 -31 -372
-3 -244 -1 -302 13 -355 42 -166 177 -290 346 -317 96 -16 489 -14 489 2 0 6
5 62 10 122 35 372 199 705 475 963 48 45 116 100 151 123 35 24 64 46 64 50
0 14 -114 111 -164 140 -28 16 -87 41 -131 56 -78 26 -86 27 -365 29 -157 1
-307 -1 -335 -6z"/>
<path d="M3964 2981 c-127 -20 -245 -77 -337 -162 -34 -31 -60 -59 -57 -61 3
-2 41 -30 85 -63 346 -254 565 -642 605 -1070 5 -60 10 -116 10 -122 0 -16
393 -18 489 -2 169 27 304 151 346 317 14 53 16 111 13 355 -3 289 -4 293 -31
371 -59 168 -163 289 -317 370 -120 63 -154 68 -470 72 -157 1 -308 -1 -336
-5z"/>
<path d="M2165 2544 c-388 -69 -703 -341 -831 -716 -43 -128 -56 -247 -52
-470 4 -188 6 -208 30 -276 37 -104 83 -176 158 -252 76 -75 147 -120 252
-158 l73 -27 765 0 765 0 73 27 c105 38 176 83 252 158 76 76 121 149 157 252
24 67 27 90 31 271 2 124 0 229 -8 279 -35 241 -136 444 -305 614 -160 161
-351 260 -579 299 -121 20 -663 20 -781 -1z"/>
</g>
                    </svg>
                  <span className="font-medium p-3 text-gray-600">Select Member</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </li>

              {/* Collapsible Menu Items */}
              <div className={`transition-all duration-300 ${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <li className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <button 
                    onClick={() => setActiveComponent('employees')}
                    className={`flex items-center text-gray-700 w-full pl-4 ${activeComponent === 'employees' ? 'font-bold' : ''}`}
                  >
                    <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#606163" stroke="none">
<path d="M2335 5105 c-273 -42 -517 -172 -708 -375 -210 -223 -319 -481 -334
-790 -21 -432 191 -845 557 -1084 180 -118 353 -178 563 -195 389 -30 721 92
989 365 213 216 321 452 347 753 36 402 -116 776 -419 1038 -196 168 -376 252
-625 288 -120 17 -260 18 -370 0z"/>
<path d="M1427 2639 c-452 -48 -766 -372 -912 -944 -97 -381 -122 -839 -60
-1090 51 -201 218 -405 411 -503 87 -44 212 -80 317 -92 62 -8 534 -10 1437
-8 l1345 3 85 24 c316 86 532 298 611 596 41 155 36 525 -12 817 -105 650
-371 1040 -792 1162 -96 28 -268 49 -319 39 -49 -9 -117 -45 -271 -144 -164
-106 -187 -118 -310 -164 -142 -53 -259 -76 -396 -76 -140 0 -248 20 -390 70
-134 48 -140 51 -350 184 -110 70 -192 115 -224 124 -56 14 -56 14 -170 2z"/>
</g>
                    </svg>
                    <span className="font-medium pl-2 text-gray-600">Panhathun</span>
                  </button>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <button 
                    onClick={() => setActiveComponent('attendance')}
                    className={`flex items-center text-gray-700 w-full pl-4 ${activeComponent === 'attendance' ? 'font-bold' : ''}`}
                  >
                    <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#606163" stroke="none">
<path d="M2335 5105 c-273 -42 -517 -172 -708 -375 -210 -223 -319 -481 -334
-790 -21 -432 191 -845 557 -1084 180 -118 353 -178 563 -195 389 -30 721 92
989 365 213 216 321 452 347 753 36 402 -116 776 -419 1038 -196 168 -376 252
-625 288 -120 17 -260 18 -370 0z"/>
<path d="M1427 2639 c-452 -48 -766 -372 -912 -944 -97 -381 -122 -839 -60
-1090 51 -201 218 -405 411 -503 87 -44 212 -80 317 -92 62 -8 534 -10 1437
-8 l1345 3 85 24 c316 86 532 298 611 596 41 155 36 525 -12 817 -105 650
-371 1040 -792 1162 -96 28 -268 49 -319 39 -49 -9 -117 -45 -271 -144 -164
-106 -187 -118 -310 -164 -142 -53 -259 -76 -396 -76 -140 0 -248 20 -390 70
-134 48 -140 51 -350 184 -110 70 -192 115 -224 124 -56 14 -56 14 -170 2z"/>
</g>
                    </svg>
                    <span className="font-medium pl-2 text-gray-600">Elliot</span>
                  </button>
                </li>
              </div>

              {/* Data Options Section */}
              <span className="text-gray-600 text-left block mt-4">Data Options</span>
              {/* Other menu items can go here */}
              <li className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <button 
                  onClick={() => setActiveComponent('edit-project')}
                  className={`flex items-center text-gray-700 w-full ${activeComponent === 'edit-project' ? 'font-bold' : ''}`}
                >
                    <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#606163" stroke="none">
<path d="M3805 4786 c-37 -16 -70 -52 -84 -89 -6 -16 -11 -100 -11 -192 l0
-163 -178 -4 c-178 -3 -179 -3 -215 -31 -69 -52 -87 -134 -46 -207 40 -70 72
-80 268 -80 l171 0 0 -171 c0 -155 2 -175 21 -208 34 -59 64 -76 141 -76 60 0
70 3 99 30 53 50 59 77 59 260 l0 165 174 0 c163 0 175 1 207 23 58 39 81 84
77 145 -6 64 -29 99 -88 130 -41 20 -58 22 -206 22 l-163 0 -3 178 -3 179 -29
37 c-46 61 -123 82 -191 52z"/>
<path d="M1302 4639 c-135 -17 -268 -75 -383 -167 -117 -93 -197 -209 -252
-366 l-32 -91 -3 -1495 c-2 -1339 -1 -1503 13 -1575 64 -318 323 -566 642
-615 45 -7 454 -10 1238 -8 1309 4 1205 -2 1370 77 163 78 291 206 366 367 78
166 73 54 76 1524 l3 1315 -25 -59 c-53 -129 -134 -214 -260 -273 -56 -26 -69
-28 -186 -28 -125 0 -125 0 -202 38 -151 75 -246 205 -272 373 l-6 41 -67 12
c-181 33 -331 172 -377 346 -44 170 9 352 136 469 51 48 94 73 189 114 30 13
-1869 14 -1968 1z m350 -1254 c45 -34 71 -90 66 -145 -16 -162 -227 -201 -299
-54 -37 77 -15 150 62 202 28 20 44 23 89 20 35 -2 66 -11 82 -23z m1827 10
c110 -56 117 -212 13 -277 l-37 -23 -643 -3 c-423 -2 -656 1 -681 8 -47 12
-96 65 -110 118 -18 64 12 136 72 172 31 19 55 20 695 20 563 0 667 -2 691
-15z m-1839 -776 c53 -30 84 -88 78 -149 -16 -163 -227 -199 -299 -52 -67 137
86 277 221 201z m1839 6 c68 -35 104 -119 82 -188 -15 -43 -68 -95 -112 -107
-47 -14 -1272 -13 -1321 0 -44 13 -94 66 -107 118 -18 64 12 136 72 172 31 19
55 20 695 20 563 0 667 -2 691 -15z m-1838 -778 c58 -39 81 -84 77 -145 -6
-64 -29 -99 -89 -130 -52 -27 -101 -25 -153 7 -47 29 -80 99 -73 153 15 112
147 176 238 115z m1833 9 c45 -19 85 -73 92 -127 8 -62 -27 -125 -86 -156
l-43 -23 -644 0 c-704 0 -685 -2 -736 59 -68 81 -48 194 43 242 33 18 71 19
688 19 535 0 659 -3 686 -14z"/>
</g>
                    </svg>
                  <span className="font-medium pl-2 text-gray-600">Edit Projects</span>
                </button>
              </li>
              <li className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <button 
                  onClick={() => setActiveComponent('edit-person')}
                  className={`flex items-center text-gray-700 w-full ${activeComponent === 'edit-person' ? 'font-bold' : ''}`}
                >
                    <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#606163" stroke="none">
<path d="M2055 5105 c-464 -64 -756 -344 -841 -808 -25 -135 -23 -383 5 -557
95 -593 308 -964 646 -1126 141 -68 194 -79 385 -79 175 0 227 9 352 59 193
78 375 261 493 495 121 243 202 587 212 906 11 366 -76 630 -276 838 -214 223
-585 326 -976 272z"/>
<path d="M1310 2595 c-52 -23 -162 -66 -245 -94 -82 -29 -188 -71 -235 -93
-161 -77 -271 -221 -348 -453 -111 -337 -216 -1168 -160 -1270 24 -44 56 -71
118 -98 272 -120 856 -252 1385 -314 245 -28 776 -21 957 13 l27 5 -25 41
c-44 69 -100 189 -128 271 -84 252 -79 555 14 808 173 475 639 809 1128 809
50 0 92 4 92 9 0 15 -91 104 -143 140 -58 40 -147 77 -336 142 -80 28 -184 68
-233 91 l-88 41 -69 -66 c-222 -209 -490 -306 -816 -294 -284 10 -516 105
-727 296 -36 34 -68 61 -70 60 -1 -1 -46 -20 -98 -44z"/>
<path d="M3716 1969 c-409 -47 -741 -338 -843 -739 -122 -480 129 -970 595
-1160 435 -177 951 -4 1201 401 101 164 144 319 144 519 0 150 -19 247 -73
378 -52 124 -117 220 -214 317 -164 164 -368 261 -596 285 -112 11 -114 11
-214 -1z m171 -390 c38 -14 83 -57 99 -96 10 -23 14 -77 14 -178 l0 -145 138
0 c165 0 199 -8 245 -60 77 -84 54 -210 -45 -259 -39 -18 -62 -21 -191 -21
l-147 0 0 -147 c0 -166 -14 -213 -73 -255 -47 -33 -148 -33 -196 1 -58 42 -71
85 -71 254 l0 147 -150 0 c-130 0 -156 3 -190 20 -83 42 -115 148 -69 230 42
74 71 85 252 88 l157 4 0 147 c0 135 2 152 23 191 38 73 129 108 204 79z"/>
</g>
                    </svg>

                  <span className="font-medium pl-2 text-gray-600">Edit Persons</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default Home; 