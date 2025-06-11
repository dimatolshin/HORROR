"use client";

import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";
import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import map from "@/app/assets/webp/contacts_map.png";
import pin from "@/app/assets/svg/pin_contacts.svg";
import phone from "@/app/assets/svg/phone_contacts.svg";
import mail from "@/app/assets/svg/mail_contacts.svg";
import locationActive from "@/app/assets/svg/location_active.svg";
import locationInactive from "@/app/assets/svg/location_inactive.svg";

interface IAddress {
  id: string;
  label: string;
  icon: StaticImageData;
  path: string;
}

interface IContacts {
  location?: string;
}

const LOCATIONS: Record<
  "first" | "second",
  { title: string; address: IAddress[] }
> = {
  first: {
    title: "Локация 1",
    address: [
      {
        id: "1",
        icon: phone,
        label: "+(375) 445-33-02-78",
        path: "tel:+(375) 445-33-02-78",
      },
      {
        id: "2",
        icon: pin,
        label: "ул. К. Маркса, 8",
        path: "https://yandex.ru/maps/-/CHFH7Bn6",
      },
      {
        id: "3",
        icon: mail,
        label: "questhouseminsk@gmail.com",
        path: "mailto:questhouseminsk@gmail.com",
      },
    ],
  },
  second: {
    title: "Локация 2",
    address: [
      {
        id: "1",
        icon: phone,
        label: "+(375) 445-33-02-78",
        path: "tel:+(375) 445-33-02-78",
      },
      {
        id: "2",
        icon: pin,
        label: "ул. Ангарская, 7",
        path: "https://yandex.ru/maps/-/CHFLA43d",
      },
      {
        id: "3",
        icon: mail,
        label: "questhouseminsk@gmail.com",
        path: "mailto:questhouseminsk@gmail.com",
      },
    ],
  },
};

const detectLocationByLabel = (
  labelFromBackend: string | undefined
): "first" | "second" => {
  if (!labelFromBackend) return "first";
  for (const key of Object.keys(LOCATIONS) as ("first" | "second")[]) {
    const found = LOCATIONS[key].address.find(
      (item) => item.label === labelFromBackend
    );
    if (found) return key;
  }
  return "first";
};

const Contacts = ({ location }: IContacts) => {
  const initialLocation = useMemo(
    () => detectLocationByLabel(location),
    [location]
  );
  const [locationValue, setLocationValue] = useState<"first" | "second">(
    initialLocation
  );
  const isStaticLocation = !!location;

  const { title, address } = LOCATIONS[locationValue];

  return (
    <section
      id="contacts"
      className="contacts section--offset pb-[36px] md:pb-[100px]"
    >
      <div className="container">
        <div className="contacts__block">
          <TitleBlockUI
            title="Наши контакты"
            label="Позвонить"
            href="tel:+(375) 445-33-02-78"
            icon={phone}
          />
          <div className="flex flex-col gap-[14px] lg:gap-[60px] lg:flex-row">
            <div className="relative shrink-0">
              {!isStaticLocation && (
                <>
                  <button
                    className="max-w-[70px] md:max-w-max absolute top-[23%] left-[25%] translate-y-[-50%] translate-x-[-50%]"
                    onClick={() => setLocationValue("first")}
                  >
                    <Image
                      src={
                        locationValue === "first"
                          ? locationActive
                          : locationInactive
                      }
                      alt="Локация 1"
                    />
                  </button>
                  <button
                    className="max-w-[70px] md:max-w-max absolute top-[50%] left-[70%] translate-y-[-50%] translate-x-[-50%]"
                    onClick={() => setLocationValue("second")}
                  >
                    <Image
                      src={
                        locationValue === "second"
                          ? locationActive
                          : locationInactive
                      }
                      alt="Локация 2"
                    />
                  </button>
                </>
              )}
              <Image
                width={788}
                height={590}
                className="rounded-4xl min-h-[334px] md:min-h-max lg:max-w-[738px] w-full"
                src={map}
                alt="карта пути Quest House"
              />
            </div>
            <address className="border-3 border-solid border-[#FFFFFF47] not-italic gap-[37px] p-[30px] w-full text-white bg-[#20393A] flex justify-center flex-col rounded-4xl md:gap-[100px] lg:px-[61px]">
              {!location && (
                <h3 className="font-[800] text-2xl border-b-1 pb-[10px] md:text-6xl md:pb-[26px]">
                  {title}
                </h3>
              )}
              <ul className="flex flex-col text-[12px] gap-2 md:text-[32px] md:gap-[20px]">
                {address.map((element) => (
                  <li key={element.id}>
                    <a
                      className="flex items-center gap-3 md:gap-[30px]"
                      href={element.path}
                    >
                      <Image src={element.icon} alt={element.label} />
                      <span>{element.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
