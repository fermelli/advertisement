(function () {
  let myLocalStorage = localStorage;

  let setMyLocalStorageDefault = () => {
    if (!myLocalStorage.getItem("advertisement")) {
      myLocalStorage.setItem(
        "advertisement",
        JSON.stringify({
          title: "Servicio Técnico Especializado",
          sections: [
            {
              id: 1,
              title: "Reparaciones en General",
              images: [
                { id: 1, src: "service0.png" },
                { id: 2, src: "service1.png" },
                { id: 3, src: "service2.png" }
              ],
              features: [
                { id: 1, text: "TV Plasma" },
                { id: 2, text: "TV LCD" },
                { id: 3, text: "Microondas" },
                { id: 4, text: "Repuestos Originales" },
                { id: 5, text: "Reproductores de DVD" }
              ]
            },
            {
              id: 2,
              title: "Reparación de Celulares",
              images: [
                { id: 1, src: "phone0.png" },
                { id: 2, src: "phone1.png" },
                { id: 3, src: "phone2.png" }
              ],
              features: [
                { id: 1, text: "Cambio de Pantallas" },
                { id: 2, text: "Táctil" },
                { id: 3, text: "Cambio de IMEI" },
                { id: 4, text: "Liberación de Dispositivos" }
              ]
            },
            {
              id: 3,
              title: "Reparación de Computadoras",
              images: [
                { id: 1, src: "pc0.png" },
                { id: 2, src: "pc1.png" },
                { id: 3, src: "pc2.png" }
              ],
              features: [
                { id: 1, text: "Laptos" },
                { id: 2, text: "Reparación de Hardware" },
                { id: 3, text: "Impresoras" }
              ]
            }
          ]
        })
      );
    }
  };

  setMyLocalStorageDefault();

  Vue.component("editor-component", {
    template: "#editor-component",
    props: {
      isActive: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        advertisement: {},
        indexEditorSectionZoneActive: 0,
        isShowTooltip: false
      };
    },
    created() {
      this.getAdvertisement();
    },
    watch: {
      isActive(newValue, oldValue) {
        if (!newValue) {
          this.getAdvertisement();
        }
      }
    },
    methods: {
      getAdvertisement() {
        this.advertisement = JSON.parse(
          myLocalStorage.getItem("advertisement")
        );
      },
      setIndexEditorSectionZoneActive(index) {
        this.indexEditorSectionZoneActive = index;
      },
      add(index, key) {
        if (this.advertisement) {
          let elements = this.advertisement.sections[index][key];
          let ids = elements.map(element => {
            return element.id;
          });

          let newId = Math.max(...ids) + 1;
          let keyNew = key === "images" ? "src" : "text";

          let element = {};

          element["id"] = newId;
          element[keyNew] = "";
          elements.push(element);
        }
      },
      remove(indexSection, index, key) {
        if (this.advertisement) {
          let elements = this.advertisement.sections[indexSection][key];
          if (elements.length - 1) {
            elements.splice(index, 1);
          }
        }
      },
      save() {
        let isValid = event.currentTarget.checkValidity();
        if (this.advertisement && isValid) {
          myLocalStorage.removeItem("advertisement");
          myLocalStorage.setItem(
            "advertisement",
            JSON.stringify(this.advertisement)
          );
          this.$root.setAdvertisement();
          this.isShowTooltip = true;
        }
      },
      closeModal() {
        this.$root.close();
        this.isShowTooltip = false;
      }
    }
  });

  Vue.component("section-component", {
    template: "#section-component",
    props: {
      section: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        indexActive: 0
      };
    },
    methods: {
      animate() {
        if (this.indexActive < this.section.images.length - 1) {
          this.indexActive++;
        } else {
          this.indexActive = 0;
        }
      },
      animationDuration() {
        return Math.round(Math.random() * 2000 + 3000) + "ms";
      }
    }
  });

  let vm = new Vue({
    el: "#app",
    data: {
      isOpen: false,
      advertisement: {}
    },
    created() {
      this.setAdvertisement();
    },
    methods: {
      setAdvertisement() {
        this.advertisement = JSON.parse(
          myLocalStorage.getItem("advertisement")
        ) || {
          title: "",
          sections: []
        };
      },
      open() {
        this.isOpen = true;
        document.body.style.overflowY = "hidden";
      },
      close() {
        this.isOpen = false;
        document.body.style.overflowY = "auto";
      }
    }
  });
})();
