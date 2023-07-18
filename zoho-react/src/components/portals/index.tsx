import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useLocalStorage } from "../../hooks/useLocalstorage";
import withAuth from "../../hoc/with-auth-redirect";
import TimelogModal from "../timelogModal";

const Portal: React.FC = () => {
  const [profile] = useLocalStorage<any>("profile", {});
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const [portals, setPortals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
  const [projectData, setProjectData] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);

  const handleGetProjects = async () => {
    try {
      const result: any = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/portals/projects/all`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (result) {
        let projects: any = [];
        projects = result?.data;
        setProjects(projects);
      }
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:17 ~ handleCallback ~ error:", error);
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-2xl mt-8">
        <h1 className="text-2xl">
          Projects of: {profile?.firstName || ""} {profile?.lastName || ""}
        </h1>
        <button
          className="px-3 py-2 text-sm font-semibold text-white bg-blue-500 rounded lg:px-4 hover:bg-blue-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div>
        <div className="max-w-[80%] m-auto mt-10">
          <div className="relative overflow-hidden not-prose bg-slate-50 rounded-xl dark:bg-slate-800/25">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
            <div className="relative overflow-auto rounded-xl">
              <div className="my-8 overflow-scroll shadow-sm">
                <table className="w-full text-sm border-collapse table-fixed">
                  <thead>
                    <tr>
                      <th
                        rowSpan={2}
                        className="p-4 pt-0 pb-3 pl-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[50px]"
                      >
                        S.N
                      </th>
                      <th
                        rowSpan={2}
                        className="p-4 pt-0 pb-3 pl-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[300px]"
                      >
                        Project Owner
                      </th>
                      <th
                        rowSpan={2}
                        className="p-4 pt-0 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[300px]"
                      >
                        Project Name
                      </th>
                      <th
                        colSpan={2}
                        className="p-4 pt-0 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[200px]"
                      >
                        Tasks
                      </th>
                      <th
                        rowSpan={2}
                        className="p-4 pt-0 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[300px]"
                      >
                        Action
                      </th>
                    </tr>
                    <tr>
                      <th className="p-4 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200">
                        Open
                      </th>
                      <th className="p-4 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200">
                        Closed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800">
                    {!projects}
                    {projects.map((project: any, index: number) => (
                      <tr key={index}>
                        <td className="p-4 pl-8 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {index + 1}.
                        </td>
                        <td className="p-4 pl-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {project?.owner_name}
                        </td>
                        <td className="p-4 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {project?.name}
                        </td>
                        <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {project?.task_count?.open}
                        </td>
                        <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {project?.task_count?.closed}
                        </td>
                        <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                navigate(
                                  `/portals/${project?.portal_id}/projects/${project?.id_string}/tasks`
                                );
                              }}
                              className="px-3 text-sm font-semibold text-green-600 rounded cursor-pointer lg:px-4 dark:text-green-500 hover:underline"
                            >
                              View Tasks
                            </button>
                            <button
                              onClick={() => {
                                setProjectData(project);
                                setShowModal(true);
                              }}
                              className="px-3 text-sm font-semibold text-blue-600 rounded cursor-pointer lg:px-4 dark:text-blue-500 hover:underline"
                            >
                              Add Time log
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="absolute inset-0 border pointer-events-none border-black/5 rounded-xl dark:border-white/5"></div>
          </div>
        </div>
      </div>
      {showModal && (
        <TimelogModal
          showModal={showModal}
          setShowModal={setShowModal}
          projectData={projectData}
        />
      )}
    </div>
  );
};

export default withAuth(Portal);
