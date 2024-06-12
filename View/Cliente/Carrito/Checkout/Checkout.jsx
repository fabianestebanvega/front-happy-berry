import { useUserContext } from "@/components/Context/UseContext";
import { useEffect, useState } from "react";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import * as Dialog from "@radix-ui/react-dialog";
import InfoIcon from "@mui/icons-material/Info";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EmailIcon from "@mui/icons-material/Email";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PublicIcon from "@mui/icons-material/Public";
import BadgeIcon from "@mui/icons-material/Badge";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { payPaypal, payPaypalConfirmar } from "@/Api/Paypal/Paypal";
import { useRouter } from "next/router";
import LockSharpIcon from "@mui/icons-material/LockSharp";
import SelectLocation from "@/components/ui/Select/SelectLocation";

import Select from "react-select";
import { Checkbox, FormControlLabel } from "@mui/material";
import { sendMailPayer } from "@/Api/Paypal/Mail";
import App from "@/client/App";
const Checkout = () => {
  //Router
  const router = useRouter();
  //Sppiner
  const [loading, setLoading] = useState(false);
  // Context
  const { cart, setCart, setStep, steps, setPayer,orderDto,setOrderDto } = useUserContext();

  //Variables con los Valores del summary
  const [total, setTotal] = useState(0);
  const [totalOld, setTotalOld] = useState(0);
  const [items, setItems] = useState(0);
  const [discount, setDiscount] = useState(0);

  //UseEffect que lee los valores de la url para realizar un pago
  // useEffect(() => {
  //   setLoading(true);
  //   // Obtener los valores de la URL
  //   const { success, paymentId, token, PayerID } = router.query;

  //   // Hacer algo con los valores (puedes realizar lógica o mostrar en la consola)

  //   const pay = {
  //     success,
  //     paymentId,
  //     token,
  //     payerId: PayerID,
  //   };
  //   
  // }, [router.query]);

  //UseEffect Guarda el carrito en el localStorage cada vez que se actualiza
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  //Cargo los valores al summary
  useEffect(() => {
   
    // Calculate the total price when the cart changes

    let subTotal = 0;
    let subTotalOld = 0;
    let subItems = 0;
    let discount = 0;
    cart.map((item) => {
      subTotal += item.price * item.quantity;
      subTotalOld += item.priceOld * item.quantity;
      subItems += item.quantity;
    });
    // Redondear los totales a dos decimales

    const roundedSubTotal = subTotal.toFixed(2);
    const roundedSubTotalOld = subTotalOld.toFixed(2);
    discount = parseFloat(roundedSubTotalOld - roundedSubTotal).toFixed(2);
    setTotal(roundedSubTotal);
    setTotalOld(roundedSubTotalOld);
    setDiscount(discount);
    setItems(subItems);
    let ordenCurrent = {
      subTotal: parseFloat(subTotalOld),
      total: parseFloat(subTotal),
      discount: parseFloat(discount),
      items: subItems,
      product: cart,
    };
    setOrder(ordenCurrent);
  }, [cart]);

  //Mensaje del summary
  const [mensaje, setMensaje] = useState({
    texto: "Order Summary",
    color: "",
  });

  //Modal eliminar producto
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  //Modal Error pago
  const [modalError, setModalError] = useState(false);
  const toggleError = () => setModalError(!modalError);

 

  //Paymen seleccionado
  const [imgPay, setImgPay] = useState([]);

 

  //Gurdar datos del formulario en el obj information
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInformation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //Datos del usuario
  const [information, setInformation] = useState(() => {
    // Comprueba si `window` está definido antes de acceder a `localStorage`
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("information")) || [];
    }
    return [];
  });
  //Datos de la orden
  const [order, setOrder] = useState([]);

  //Boton Pay Genera la url de paypal
  const payMethod = (e) => {
    e.preventDefault();
    let mensaje = {
      texto: "Summary Orden",
      color: "",
    };
    setMensaje(mensaje);

    const ordenDto = {
      usuario: information,

      total: order.total.toFixed(2),
      subtotal: order.subTotal,
      discount: order.discount,
      items: order.items,
      currency: "USD",
      method: "paypal",
      intent: "CAPTURE",
      description: "excel specialist",
      termsAndConditions: order.termsAndConditions,
      product: order.product.map((product) => {
        const { features, ...productWithoutFeatures } = product;
        return productWithoutFeatures;
      }),
    };

      
      localStorage.setItem("information", JSON.stringify(information));
      setLoading(true);
      setOrderDto(ordenDto)
      setTimeout(() => {
        setStep((prevSteps) => ({
          ...prevSteps,
          currentStep: 4,
        }));
        setLoading(false);
      }, 500);
     
    
  };

  //Funcion para volver summary

  const backSummary = () => {
    toggle();
    setLoading(true);
    setTimeout(() => {
      setStep((prevSteps) => ({
        ...prevSteps,
        currentStep: 2,
      }));
      setLoading(false);
    }, 1000);
  };

  ////////////////////////////////////Select Cargar  Pais y cidudades

  //Busca los paises si el usuario no a registrado informacion
  useEffect(() => {
    if (information?.country === null) {
      // Obtener la lista de países al cargar el componente
      countryData();
    } else {
      try {
        let array = information?.country?.split("-");
        let name = array[1];
        let cca2 = array[0];
        let pais = {
          value: cca2 + "-" + name,
          label: cca2 + "-" + name,
          data: null,
        };
        setSelectedCountry(pais);
        let ciudad = information?.city;

        let city = {
          value: ciudad,
          label: ciudad,
          data: null,
        };

        setSelectedCity(city);

        setAddress(information?.address);
      } catch (error) {
        console.log(error);
      }
    }
  }, [information]);
  //Lista de paises
  const [countries, setCountries] = useState([]);
  //Lista de ciudades
  const [cities, setCities] = useState([]);
  //Select con la informacion del pais selecionado
  const [selectedCountry, setSelectedCountry] = useState("");

  //Select con la informacion de la ciudad selecionada
  const [selectedCity, setSelectedCity] = useState("");

  const [clickCount, setClickCount] = useState(0);
  const [clickCountCity, setClickCountCity] = useState(0);
  //Estructura del option pais
  const Option = ({ innerProps, label, data }) => {
    return (
      <div
        {...innerProps}
        className="bg-gray-900 flex items-center text-gray-100"
      >
        {data?.data.flags?.png !== undefined && (
          <img
            src={data?.data?.flags?.png}
            alt="country-flag"
            className="rounded-lg mr-2 mt-3"
            width="40px"
            height="20px"
          />
        )}

        <span className="text-gray-100 mt-3">{label}</span>
      </div>
    );
  };

  //Click Country
  const onClick = (e) => {
    setClickCount(clickCount + 1);
    e.preventDefault();
    e.stopPropagation();
  };
  //Click City
  const onClickCity = (e) => {
    setClickCount(clickCountCity + 1);
    e.preventDefault();
    e.stopPropagation();
  };
  //Funcion para selecionar un pais
  const handleCountryChangeSelect = (selectedOption) => {
    try {
      setSelectedCountry(selectedOption);
      //City lo vuelvo null
      setSelectedCity(null);
      setInformation((prevData) => ({
        ...prevData,
        ["city"]: "",
      }));
      //Postal code lo vuelvo null
      setInformation((prevData) => ({
        ...prevData,
        ["postal"]: "",
      }));
      //Address code lo vuelvo null
      setInformation((prevData) => ({
        ...prevData,
        ["address"]: "",
      }));
      //Value pais
      let value =
        selectedOption?.data?.cca2 + "-" + selectedOption?.data?.name?.common;

      let name = "country";
      //Guardo el pais en el obj information
      setInformation((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      // Obtener la lista de ciudades y estados según el país seleccionado
      const country = value?.split("-")[0];
      cityData(country);
    } catch (error) {
      console.log(error);
    }
  };
  //Funcion para selecionar una ciudad
  const handleCityChangeSelect = (selectedCity) => {
    //Guardo la ciudad selecionada
    setSelectedCity(selectedCity);
    let value =
      selectedCity?.data?.name + ", " + selectedCity?.data?.adminName1;

    let name = "city";
    //Guardo en information la ciudad
    setInformation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handlePostalCode(selectedCity);
    // //Address code lo vuelvo null
    // setInformation((prevData) => ({
    //   ...prevData,
    //   ["address"]: value,
    // }));
    // setAddress(value);
  };
  //Funcion para buscar codigo postal
  const handlePostalCode = (selectedCity) => {
    const cityName = selectedCity?.data?.name;
    const countryCode = selectedCountry?.label?.split("-")[0]; // Código de país, por ejemplo, "CO" para Colombia

    const apiKey = "cquintero99"; // Reemplaza con tu propia clave API

    //  const apiUrl = `http://api.geonames.org/postalCodeSearchJSON?placename=${cityName}&country=${countryCode}&username=${apiKey}`;
    const apiUrl = `https://secure.geonames.org/postalCodeSearchJSON?placename=${cityName}&country=${countryCode}&username=${apiKey}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.postalCodes && data.postalCodes.length > 0) {
          const postalCode = data.postalCodes[0].postalCode;
          setInformation((prevData) => ({
            ...prevData,
            ["postal"]: postalCode,
          }));
        } else {
          console.log(`No se encontraron códigos postales para ${cityName}`);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el código postal:", error);
      });
  };

  //Funcion para cambiar de pais
  const handleCountryReset = () => {
    countryData();
  };
  //Buscar para cambiar de  ciudad
  const handleCityReset = () => {
    try {
      let code = selectedCountry?.label?.split("-")[0];

      if (cities?.length <= 0) {
        cityData(code);
      }
      if (cities?.length > 0) {
        if (code !== cities[0]?.data?.countryCode) {
          cityData(code);
        }
      }
    } catch (error) {}
  };
  //Funcion que busca la ciudades de un pais
  const cityData = (country) => {
    setLoading(true);
    fetch(
      `https://secure.geonames.org/searchJSON?country=${country}&featureClass=P&username=cquintero99`
    )
      .then((response) => response.json())
      .then((data) => {
        let ciudades = [];
        for (const city of data.geonames) {
          let ciudad = {
            value: city?.name + ", " + city?.adminName1,
            label: city?.name + ", " + city?.adminName1,
            data: city,
          };
          ciudades.push(ciudad);
        }
        setCities(ciudades);
      })
      .catch((error) => {
        console.error("Error al obtener la lista de ciudades:", error);
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  //Funcion que busca los paises API
  const countryData = () => {
    if (countries.length <= 0) {
      setLoading(true);
      fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => {
          let paises = [];
          for (const country of data) {
            let pais = {
              value: country?.name?.common,
              label: country?.cca2 + "-" + country?.name?.common,
              data: country,
            };
            paises.push(pais);
          }
          setCountries(paises);
        })
        .catch((error) => {
          console.error("Error al obtener la lista de países:", error);
        })
        .finally((f) => {
          setLoading(false);
        });
    }
  };

  //Direccion
  const [address, setAddress] = useState(() => {
    if (information?.address !== null) {
      return information?.address;
    }
    return "";
  });
  const [predictions, setPredictions] = useState([]);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const apiKey = "AIzaSyDfpdNDilsvK7MCtsdmv7lwZ567Yx9Pqv0";
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.onload = () => setGoogleMapsLoaded(true);
        document.head.appendChild(script);
      }
    };

    loadGoogleMaps();
  }, []);

  const handleChangeAddress = (event) => {
    try {
      const inputAddress = event.target.value;
      setAddress(inputAddress);
      const addressCurrent = selectedCity?.label + " " + inputAddress;
      const cca2n = selectedCountry.label.split("-")[0];
      if (inputAddress.trim() !== "" && googleMapsLoaded) {
        const autoCompleteService =
          new window.google.maps.places.AutocompleteService();
        autoCompleteService.getPlacePredictions(
          {
            input: addressCurrent,
            types: ["address"],
            componentRestrictions: { country: cca2n },
          },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPredictions(predictions);
            }
          }
        );
      } else {
        setPredictions([]);
      }
    } catch (error) {}
  };

  const handleSelect = (prediction) => {
    
    setAddress(prediction.description);
    setInformation((prevData) => ({
      ...prevData,
      ["address"]: prediction.description,
    }));
    setPredictions([]);
  };
  const [checked, setChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);

    // Actualizar el objeto information
    setOrder((prevOrder) => ({
      ...prevOrder,
      termsAndConditions: isChecked,
    }));
  };
  return (
    <>
      {steps.currentStep === 3 && (
        <>
          { cart.length > 0 ? (
            <form onSubmit={payMethod}>
              {loading && (
                <div className="overlay">
                  <div className="spinner " aria-hidden="true"></div>
                </div>
              )}
              <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                <div class="rounded-lg border md:w-2/3">
                  <div className="mt-0 max-w-xl mx-auto">
                    <div className="space-y-3 text-gray-100">
                      <h1 className="text-gray-100 font-bold text-between mt-3">
                        Contact Information
                      </h1>
                      <div className="flex text-gray-100 flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                        <div>
                          <label className="font-medium">First name</label>
                          <div className="relative mt-2">
                            <BadgeIcon className="w-6 h-6 text-gray-100 absolute left-3 inset-y-0 my-auto" />

                            <input
                              name="firstName"
                              id="firstName"
                              type="text"
                              value={information.firstName}
                              onChange={handleChange}
                              placeholder="Enter your first name"
                              required
                              className="w-full pl-12 pr-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="font-medium">Last name</label>
                          <div className="relative mt-2">
                            <BadgeIcon className="w-6 h-6 text-gray-100 absolute left-3 inset-y-0 my-auto" />

                            <input
                              name="lastName"
                              id="lastName"
                              type="text"
                              value={information.lastName}
                              onChange={handleChange}
                              placeholder="Enter your last name"
                              required
                              className="w-full pl-12 pr-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="font-medium">Email</label>
                        <div className="relative mt-2">
                          <EmailIcon className="w-6 h-6 text-gray-100 absolute left-3 inset-y-0 my-auto" />
                          <input
                            name="email"
                            id="email"
                            type="email"
                            value={information.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="w-full pl-12 pr-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex text-gray-100 flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                        <div>
                          <label className="font-medium">DNI</label>
                          <div className="relative mt-2">
                            <ContactEmergencyIcon className="w-6 h-6 text-gray-100 absolute left-3 inset-y-0 my-auto" />
                            <input
                              name="dni"
                              id="dni"
                              type="number"
                              value={information.dni}
                              onChange={handleChange}
                              required
                              placeholder="Enter your DNI"
                              className="w-full pl-12 pr-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="font-medium">Phone number</label>
                          <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                              <select className="text-sm bg-gray-900 outline-none rounded-lg h-full">
                                <option>US</option>
                                <option>ES</option>
                                <option>MR</option>
                              </select>
                            </div>
                            <input
                              name="phone"
                              id="phone"
                              type="number"
                              value={information.phone}
                              onChange={handleChange}
                              placeholder="+1 (555) 000-000"
                              required
                              className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="font-medium">Country</label>
                        <div className="relative mt-2">
                          <Select
                            name="country"
                            id="country"
                            //classNamePrefix="w-full px-3 py-2 text-sm text-gray-100 bg-gray-900 border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-green-600 focus:ring-2"
                            classNamePrefix="text-white "
                            className="text-white "
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                backgroundColor: "transparent", // Replace with your desired dark background color
                                color: "white",
                              }),
                              singleValue: (provided, state) => ({
                                ...provided,
                                color: "white", // Cambia a tu color de texto deseado (blanco en este caso)
                              }),
                            }}
                            onEmojiClick={onClick}
                            components={{ Option }}
                            isSearchable
                            options={countries}
                            value={selectedCountry}
                            onChange={handleCountryChangeSelect}
                            onMenuOpen={handleCountryReset}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-medium">City</label>
                        <div className="relative mt-2">
                          <Select
                            name="city"
                            id="city"
                            //classNamePrefix="w-full px-3 py-2 text-sm text-gray-100 bg-gray-900 border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-green-600 focus:ring-2"
                            classNamePrefix="text-gray-100 bg-gray-900"
                            className="text-gray-100 bg-gray-900"
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                backgroundColor: "transparent", // Replace with your desired dark background color
                                color: "white",
                              }),
                              singleValue: (provided, state) => ({
                                ...provided,
                                color: "white", // Cambia a tu color de texto deseado (blanco en este caso)
                              }),
                            }}
                            onEmojiClick={onClickCity}
                            components={{ Option }}
                            isSearchable
                            options={cities}
                            value={selectedCity}
                            onChange={handleCityChangeSelect}
                            onMenuOpen={handleCityReset}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-medium">Postal Code</label>
                        <div className="relative mt-2">
                          <MarkunreadMailboxIcon className="w-6 h-6 text-gray-100 absolute left-3 inset-y-0 my-auto" />

                          <input
                            name="postal"
                            id="postal"
                            type="text"
                            value={information.postal}
                            onChange={handleChange}
                            placeholder="Enter your postal code"
                            required
                            className="w-full pl-12 pr-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-medium">Address</label>
                        <div className="relative mt-2">
                          <LocationOnIcon className="w-6 h-6 text-gray-100 absolute left-3 inset-y-0 my-auto" />
                          <input
                            name="address"
                            id="address"
                            type="text"
                            value={address}
                            onChange={handleChangeAddress}
                            required
                            placeholder="Enter your address"
                            className="w-full pl-12 pr-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                          />
                          <ul>
                            {predictions.map((prediction) => (
                              <li
                                key={prediction.place_id}
                                onClick={() => handleSelect(prediction)}
                              >
                                {prediction.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* <div className="flex text-gray-100 flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                        <div>
                          <input
                            type="text"
                            placeholder="Escribe tu dirección"
                            value={address}
                            onChange={handleChangeAddress}
                          />
                          <ul>
                            {predictions.map((prediction) => (
                              <li
                                key={prediction.place_id}
                                onClick={() => handleSelect(prediction)}
                              >
                                {prediction.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div> */}
                      <br />
                    </div>
                  </div>
                </div>

                <div class="mt-6 h-full rounded-lg  border text-white p-6 shadow-md md:mt-0 md:w-1/3">
                  <div
                    class={`  mb-2 flex justify-between rounded-md  border  bg-gray-900`}
                  >
                    <div className="flex justify-between py-3">
                      <div className="flex">
                        <div>
                          <WavingHandIcon />
                        </div>
                        <div className="self-center ml-3">
                          <span
                            className={`text-${mensaje.color}-600 mt-1 font-bold`}
                          >
                            {mensaje.texto}
                          </span>
                        </div>
                      </div>
                      <button className="self-start text-green-500">
                        <div>{mensaje.icon}</div>
                      </button>
                    </div>
                  </div>
                  {/* <label
                    id="listbox-label"
                    class="block text-sm font-medium leading-6 text-gray-100"
                  >
                    {" "}
                    <PaymentIcon /> Payment method
                  </label>
                  <div class="mb-4 flex justify-between">
                    <div className="flex justify-between ">
                      <div className="relative  w-72 max-w-full mx-auto mt-3">
                        <KeyboardArrowDownIcon className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3" />
                        <select
                          required
                          name="payment"
                          id="payment"
                          className="w-full   px-3 py-2 text-sm text-gray-100 bg-gray-900 border  rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-green-600 focus:ring-2"
                          onChange={handlePaymentMethodChange}
                        >
                          <option selected>Select payment method</option>
                          {payment.map((pay) => (
                            <option
                              key={pay.value}
                              value={pay.value}
                              disabled={pay.disabled}
                            >
                              {pay.name}
                            </option>
                          ))}
                       
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="mb-2 flex justify-center ">
                    <img src={imgPay.url} width="173" alt="" />
                  </div> */}
                  <div class="mb-2 flex justify-between">
                    <p class="text-white-700">Subtotal</p>
                    <p class="text-white-900 font-bold">${totalOld}</p>
                  </div>
                  <div class="flex mb-2 justify-between">
                    <p class="text-white-700">Discount</p>
                    <p class="text-white-700 font-bold">- ${discount}</p>
                  </div>
                  {/* <div class="flex justify-between">
              <p class="text-white-700">pay</p>
              <p class="text-white-700 font-bold">${total}.00</p>
            </div> */}
                  <hr class="my-4" />
                  <div class="flex justify-between">
                    <p class="text-lg font-bold">Total</p>
                    <div class="">
                      <p class="mb-1 text-lg font-bold">${total} USD</p>
                      <p class="text-sm text-gray-500">Items : {items}</p>
                    </div>
                  </div>
                  <div>
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          className="rounded-md border bg-gray-900 py-1.5 font-medium text-blue-50 "
                          defaultChecked
                        />
                      }
                      label="Terms and Conditions"
                    /> */}
                    <div className="flex items-center">
                      <Checkbox
                        className="rounded-md border bg-gray-900 py-1.5 font-medium text-blue-50"
                        defaultChecked={checked}
                        onChange={handleCheckboxChange}
                        required
                        title="Do you accept the Terms and Conditions?."
                      />
                      <label className="ml-2 text-blue-50">
                        <a
                          href="/excel-specialist/terms/conditions"
                          target="_blank"
                          className="ont-medium text-blue-50 hover:bg-blue-700"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="mt-6 w-full rounded-md border bg-gray-900 py-1.5 font-medium text-blue-50 hover:bg-green-700"
                  >
                    Pay
                  </button>
                 
                  <h2 className="text-center  font-bold mt-3">
                    {" "}
                    <LockSharpIcon />
                    Secure payment
                  </h2>
                </div>
              </div>
              <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                <div class="rounded-lg  md:w-full">
                  <h1
                    className="text-gray-300 font-bold text-between mt-3 hover:text-red-600"
                    onClick={toggle}
                    title="Back to summarry"
                  >
                    <button type="button">
                      <ArrowBackIcon /> Back to Summary
                    </button>
                  </h1>
                </div>
              </div>
              
            </form>
          ) : (
            <h1 class="mb-10 text-center text-white text-2xl font-bold">
              Empty Cart <Battery0BarIcon />
            </h1>
          )}
        </>
      )}

      <Dialog.Root open={modal} onClose={toggle}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40 " />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
            <div className="bg-gray-900 text-gray-100 rounded-md  shadow-lg px-4 py-6">
              <div className=" flex items-center justify-center  w-12 h-12 mx-auto bg-red-100 rounded-full">
                <InfoIcon className="text-red-500 text-6xl font-bold" />
              </div>
              <Dialog.Title className="text-2xl font-bold text-white text-center mt-3">
                {" "}
                Back to Summary?
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-center text-gray-500"></Dialog.Description>
              <div className="items-center gap-2 mt-3 text-sm sm:flex">
                <Dialog.Close asChild>
                  <button
                    onClick={backSummary}
                    className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                  >
                    Yes
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    onClick={toggle}
                    className="w-full mt-2 p-2.5 flex-1 text-white rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                    aria-label="Close"
                  >
                    Keep buying
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={modalError} onClose={toggleError}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40 " />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
            <div className="bg-gray-900 text-gray-100 rounded-md  shadow-lg px-4 py-6">
              <div className=" flex items-center justify-center  w-12 h-12 mx-auto bg-red-100 rounded-full">
                <InfoIcon className="text-red-500 text-6xl font-bold" />
              </div>
              <Dialog.Title className="text-2xl font-bold text-white text-center mt-3">
                {" "}
                An error occurred while starting the payment Please verify
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-center text-gray-500"></Dialog.Description>
              <div className="items-center gap-2 mt-3 text-sm sm:flex">
                <Dialog.Close asChild>
                  <button
                    onClick={toggleError}
                    className="w-full mt-2 p-2.5 flex-1 text-white rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                    aria-label="Close"
                  >
                    back
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default Checkout;
