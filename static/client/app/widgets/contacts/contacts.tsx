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

type LocationKey = "first" | "second";

const LOCATIONS: Record<LocationKey, { title: string; address: IAddress[] }> = {
  first: {
    title: "Локация 1",
    address: [
      {
        id: "1",
        icon: phone,
        label: "+375 (44) 533-02-78",
        path: "tel:+375 (44) 533-02-78",
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
        label: "+375 (44) 533-02-78",
        path: "tel:+375 (44) 533-02-78",
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

const normalizeAddress = (address: string): string => {
  return address
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[.,]/g, "");
};

const addressContains = (fullAddress: string, searchTerm: string): boolean => {
  const normalized = normalizeAddress(fullAddress);
  const normalizedSearch = normalizeAddress(searchTerm);
  return normalized.includes(normalizedSearch);
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
};

const stringSimilarity = (str1: string, str2: string): number => {
  const distance = levenshteinDistance(
      normalizeAddress(str1),
      normalizeAddress(str2)
  );
  const maxLen = Math.max(str1.length, str2.length);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
};

const detectLocationByLabel = (
    labelFromBackend: string | undefined
): LocationKey | null => {
  if (!labelFromBackend) return null;

  let bestMatch: { key: LocationKey; score: number } | null = null;

  for (const key of Object.keys(LOCATIONS) as LocationKey[]) {
    const addressItems = LOCATIONS[key].address;

    for (const item of addressItems) {
      if (addressContains(item.label, labelFromBackend)) {
        return key;
      }

      const similarity = stringSimilarity(item.label, labelFromBackend);

      if (similarity > 0.7) {
        if (!bestMatch || similarity > bestMatch.score) {
          bestMatch = { key, score: similarity };
        }
      }
    }
  }

  return bestMatch ? bestMatch.key : null;
};

const Contacts = ({ location }: IContacts) => {
  const detectedLocation = useMemo(
      () => detectLocationByLabel(location),
      [location]
  );

  const isStaticLocation = detectedLocation !== null;

  const [activeLocationKey, setActiveLocationKey] =
      useState<LocationKey>("first");

  const displayLocationKey = isStaticLocation
      ? detectedLocation!
      : activeLocationKey;

  const { title, address } = LOCATIONS[displayLocationKey];

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
                href="tel:+375 (44) 533-02-78"
                icon={phone}
            />
            <div className="flex flex-col gap-[14px] lg:gap-[60px] lg:flex-row">
              <div className="relative shrink-0">
                {isStaticLocation ? (
                    <div
                        className={`max-w-[70px] md:max-w-max absolute translate-y-[-50%] translate-x-[-50%] ${
                            displayLocationKey === "first"
                                ? "top-[23%] left-[25%]"
                                : "top-[50%] left-[70%]"
                        }`}
                    >
                      <Image src={locationActive} alt={`Локация ${title}`} />
                    </div>
                ) : (
                    <>
                      <button
                          className="max-w-[70px] md:max-w-max absolute top-[23%] left-[25%] translate-y-[-50%] translate-x-[-50%]"
                          onClick={() => setActiveLocationKey("first")}
                      >
                        <Image
                            src={
                              activeLocationKey === "first"
                                  ? locationActive
                                  : locationInactive
                            }
                            alt="Локация 1"
                        />
                      </button>
                      <button
                          className="max-w-[70px] md:max-w-max absolute top-[50%] left-[70%] translate-y-[-50%] translate-x-[-50%]"
                          onClick={() => setActiveLocationKey("second")}
                      >
                        <Image
                            src={
                              activeLocationKey === "second"
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
                {!isStaticLocation && (
                    <h3 className="font-[800] text-2xl border-b-1 pb-[10px] md:text-[40px] md:pb-[26px]">
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
                          <Image src={element.icon} alt={"иконка контакта"} />
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
