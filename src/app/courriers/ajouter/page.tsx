import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";

const AjouterCourrier = () => {
  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Ajout d'un courrier" />

        <div className="gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            {/* <!-- Contact Form --> */}
            <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                <h3 className="font-semibold text-dark dark:text-white">
                  Contact Form
                </h3>
              </div>
              <form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <InputGroup
                      label="First name"
                      type="text"
                      placeholder="Enter your first name"
                      customClasses="w-full xl:w-1/2"
                    />

                    <InputGroup
                      label="Last name"
                      type="text"
                      placeholder="Enter your last name"
                      customClasses="w-full xl:w-1/2"
                    />
                  </div>

                  <InputGroup
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    customClasses="mb-4.5"
                    required
                  />

                  <InputGroup
                    label="Subject"
                    type="text"
                    placeholder="Enter your subject"
                    customClasses="mb-4.5"
                  />

                  <SelectGroupOne />

                  <div className="mb-6">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Type your message"
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>

                  <button className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default AjouterCourrier;
