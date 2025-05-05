import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/shared';

const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} className="bg-white px-6 py-2">
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/', { viewTransition: true })}
            className="bg-blue-600 rounded hover:bg-blue-700 px-6 py-2 text-white"
          >
            Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
