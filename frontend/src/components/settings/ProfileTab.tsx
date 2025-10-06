// import React from "react";
// import { Card, CardBody, CardFooter, CardHeader } from "../common/Card";

// interface ProfileTabProps {
//   user: any;
//   name: string;
//   setName: (name: string) => void;
//   username: string;
//   setUsername: (username: string) => void;
//   savingProfile: boolean;
//   profileMsg: string;
//   handleProfileSave: (e: React.FormEvent) => void;
//   currentPin: string;
//   setCurrentPin: (pin: string) => void;
//   newPin: string;
//   setNewPin: (pin: string) => void;
//   pinMsg: string;
//   pinSaving: boolean;
//   handlePinChange: (e: React.FormEvent) => void;
// }

// const ProfileTab: React.FC<ProfileTabProps> = ({
//   user,
//   name,
//   setName,
//   username,
//   setUsername,
//   savingProfile,
//   profileMsg,
//   handleProfileSave,
//   currentPin,
//   setCurrentPin,
//   newPin,
//   setNewPin,
//   pinMsg,
//   pinSaving,
//   handlePinChange,
// }) => {
//   return (
//     <div className="mb-8">
//       <Card className="mb-8">
//         <CardHeader>
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
//               {user?.name?.[0]?.toUpperCase() || "U"}
//             </div>
//             <div>
//               <div className="text-lg font-bold text-gray-800">{user?.name || "User"}</div>
//               <div className="text-gray-500 text-sm">@{user?.username}</div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardBody>
//           <form onSubmit={handleProfileSave} className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium">Name</label>
//               <input
//                 className="input input-bordered w-full"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Username</label>
//               <input
//                 className="input input-bordered w-full"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <CardFooter align="left">
//               <button className="btn btn-primary" type="submit" disabled={savingProfile}>
//                 {savingProfile ? "Saving..." : "Save Changes"}
//               </button>
//               {profileMsg && <span className="ml-3 text-green-600 text-sm">{profileMsg}</span>}
//             </CardFooter>
//           </form>
//         </CardBody>
//       </Card>
//       <Card>
//         <CardHeader>Change PIN</CardHeader>
//         <CardBody>
//           <form onSubmit={handlePinChange} className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium">Current PIN</label>
//               <input
//                 className="input input-bordered w-full"
//                 type="password"
//                 value={currentPin}
//                 onChange={(e) => setCurrentPin(e.target.value)}
//                 minLength={4}
//                 maxLength={6}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">New PIN</label>
//               <input
//                 className="input input-bordered w-full"
//                 type="password"
//                 value={newPin}
//                 onChange={(e) => setNewPin(e.target.value)}
//                 minLength={4}
//                 maxLength={6}
//                 required
//               />
//               <span className="text-xs text-gray-400">PIN must be 4-6 digits</span>
//             </div>
//             <CardFooter align="left">
//               <button className="btn btn-secondary" type="submit" disabled={pinSaving}>
//                 {pinSaving ? "Changing..." : "Change PIN"}
//               </button>
//               {pinMsg && <span className="ml-3 text-green-600 text-sm">{pinMsg}</span>}
//             </CardFooter>
//           </form>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default ProfileTab;
