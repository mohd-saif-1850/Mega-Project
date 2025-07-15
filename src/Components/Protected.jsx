import React, {use, useEffect,useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Protected({children, authentication = true}) {
    const authStatus = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if(authentication && authStatus !== authentication){
            navigate('/login');
        }
        else if(!authentication && authStatus !== authentication){
            navigate('/');
        }
        setLoader(false);
    },[navigate, authStatus,authentication]);
  return loader ? (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  ) : (
    <div>
      {children}
    </div>
  );
  
}

export default Protected
