// components/SidebarMenu.tsx
import { useLocation } from "react-router";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { assets } from "~/assets/assets";
import { ALL_STEPS } from "~/const/sidebar_step";
import { useIsMobile } from "~/hook/use-mobile";
import { useStepStore } from "~/store/stepStore";
import Banner from "~/features/index/components/Banner";

export function SidebarMenu() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { currentStep, setStep } = useStepStore();

  // Helper function to check if a step should be active based on current path
  const isStepActiveByPath = (step: any, currentPath: string) => {
    // For step 3 (Data Infrastruktur), check if we're in any /infrastruktur/* route except /infrastruktur itself
    if (step.number === 3 && currentPath.startsWith("/infrastruktur/")) {
      return true;
    }
    // For step 2 (Jenis Infrastruktur), only active when exactly on /infrastruktur
    if (step.number === 2 && currentPath === "/infrastruktur") {
      return true;
    }
    // For other steps, exact match
    if (step.number !== 2 && step.number !== 3) {
      return step.path === currentPath;
    }
    return false;
  };

  // Sync step store with current route, but only when route doesn't match current step
  useEffect(() => {
    let matchedStep = null;

    // Special handling for infrastruktur routes
    if (location.pathname.startsWith("/infrastruktur/")) {
      // If we're on a /infrastruktur/* route, set to step 3 (Data Infrastruktur)
      matchedStep = ALL_STEPS.find((step) => step.number === 3);
    } else {
      // For other routes, find exact match
      matchedStep = ALL_STEPS.find((step) => step.path === location.pathname);
    }

    if (matchedStep && matchedStep.number !== currentStep.number) {
      setStep(matchedStep);
    }
  }, [location.pathname, currentStep.number, setStep]);

  return (
    <>
      {!isMobile ? (
        <aside className="lg:block lg:sticky lg:top-[5%] h-fit">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Logo */}
            <div className="flex justify-center items-center gap-3 my-5">
              <img
                src={assets.imageLogoNgawi}
                alt="Logo Ngawi"
                width={25}
                height={25}
              />
              <span className="h-[20px] w-[1px] bg-gray-400"></span>
              <img
                src={assets.imageLogo}
                alt="Logo Jagoan Data"
                width={120}
                height={120}
              />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {ALL_STEPS.map((step, index) => {
                // Updated logic - prioritize exact path match over wildcard
                const isActive =
                  currentStep.number === step.number ||
                  isStepActiveByPath(step, location.pathname);
                const isCompleted = currentStep.number > step.number;

                return (
                  <div key={step.number} className="block ">
                    <div className="relative">
                      <div
                        className={`flex gap-4 p-4 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-blue-100"
                            : isCompleted
                              ? "bg-blue-50"
                              : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                            isCompleted || isActive
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <Icon icon="mdi:check" className="w-5 h-5" />
                          ) : (
                            step.number
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold text-base mb-1 ${
                              isActive
                                ? "text-blue-600"
                                : isCompleted
                                  ? "text-blue-700"
                                  : "text-gray-800"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                      {index < ALL_STEPS.length - 1 && (
                        <div
                          className={`absolute left-[30px] top-[56px] w-0.5 h-6 transition-colors ${
                            isCompleted || isActive
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Help Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <button className="w-full flex justify-between items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100 hover:border-blue-200 transition-all duration-200 group">
                <div className="text-left">
                  <p className="font-semibold text-base text-gray-800 group-hover:text-blue-700">
                    Hubungi atau Perlu Bantuan?
                  </p>
                  <p className="text-xs text-gray-600 group-hover:text-blue-600 mt-1">
                    Tim support siap membantu Anda
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors duration-200">
                  <Icon
                    icon="material-symbols:support-agent"
                    className="w-5 h-5 text-blue-600 group-hover:text-blue-700"
                  />
                </div>
              </button>
            </div>
          </div>
        </aside>
      ) : (
        /* Mobile */
        <div className="">
          <div className="bg-white flex justify-between items-center px-4 py-1 rounded-xl mb-5">
            <div className="flex justify-center items-center gap-3 my-5">
              <img
                src={assets.imageLogoNgawi}
                alt="Logo Ngawi"
                width={25}
                height={25}
              />
              <span className="h-[20px] w-[1px] bg-gray-400"></span>
              <img
                src={assets.imageLogo}
                alt="Logo Jagoan Data"
                width={120}
                height={120}
              />
            </div>
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <Icon
                icon="material-symbols:headset-mic"
                className="w-6 h-6 text-gray-600"
              />
            </div>
          </div>
          {currentStep.number === 1 && <Banner />}
          <div className="sticky top-0 bg-white border-b rounded-xl border-gray-200 shadow-sm z-50 px-4 py-4">
            <div className="mt-3 text-center mb-4">
              <p className="text-normal font-semibold text-blue-600">
                {currentStep.title}
              </p>
            </div>
            <div className="flex items-center justify-between">
              {ALL_STEPS.map((step, index) => {
                const isCompleted = index < currentStep.number - 1;
                // Updated logic for mobile view - prioritize store state over path matching
                const isActive =
                  index === currentStep.number - 1 ||
                  isStepActiveByPath(step, location.pathname);

                return (
                  <div
                    key={step.number}
                    className={`flex items-center ${index < ALL_STEPS.length - 1 ? "flex-1" : ""}`}
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                          isCompleted
                            ? "bg-blue-600 text-white"
                            : isActive
                              ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                        }`}
                      >
                        {isCompleted ? (
                          <Icon icon="mdi:check" className="w-6 h-6" />
                        ) : (
                          step.number
                        )}
                      </div>
                    </div>
                    {index < ALL_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                          index < currentStep.number - 1
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
