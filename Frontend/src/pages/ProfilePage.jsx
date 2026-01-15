import { useAuthStore } from "../store/useAuthStore"

 export const ProfilePage = () => {
  const { authUser , isUpdatingProfile , updateProfilePic } = useAuthStore();
   const handleProfilePicChange = async (e) => {
     const file = e.target.files[0];  
      if (file) {

        updateProfilePic(file);
      }   
    };
    
  return (
    <div>profilePage</div>
  )
}

export default ProfilePage