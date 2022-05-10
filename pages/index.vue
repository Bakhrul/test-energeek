<template>
  <div>
    <Navbar></Navbar>
    <section class="page-wrapper">
      <div class="container">
        <div class="d-flex flex-wrap mb-3">
          <div class="page-title me-3">Inventory</div>
          <button v-if="username == 'Administrator'" class="btn btn-primary" type="button" @click="add"><i class="fa fa-plus"></i>&ensp;Tambah
            Data</button>
        </div>
        <div class="card mb-5">
          <div class="card-body">
            <div class="table-responsive">
              <table id="example" class="table table-bordered table-custom" style="width:100%;min-width:800px;">
                <thead>
                  <tr>
                    <th class="text-center">No</th>
                    <th>Kode Barang</th>
                    <th>Nama Barang</th>
                    <th>Minimal Stok</th>
                    <th>Stok</th>
                    <th class="text-center">Status Stok</th>
                    <th class="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(context, index) in item" :key="index">
                    <td style="vertical-align:middle;" class="text-center">{{index + 1}}</td>
                    <td style="vertical-align:middle;">{{context.code}}</td>
                    <td style="vertical-align:middle;">{{context.name}}</td>
                    <td style="vertical-align:middle;">{{context.minimum_stock}}</td>
                    <td style="vertical-align:middle;">{{context.stock}}</td>
                    <td class="text-center">
                      <span v-if="parseInt(context.stock) >= parseInt(context.minimum_stock)" class="badge  bg-info p-2"
                        style="font-size:14px;font-weight:normal;">Aman</span>
                      <span v-else class="badge  bg-warning p-2" style="font-size:14px;font-weight:normal;">Dibawah
                        minimal</span>
                    </td>
                    <td class="text-center">
                      <div class="d-flex justify-content-center align-items-center">
                        <div v-if="username == 'Administrator'" @click="edit(index)"><i class="fa fa-edit icon-action"></i></div>
                        <div @click="history(index)"><i class="fa fa-history icon-action"></i></div>
                        <div v-if="username == 'Administrator'" @click="confirmHapus(index)"><i class="fa fa-trash icon-action"></i></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div id="modal-item" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="exampleModalLabel" class="modal-title">{{flag == 'insert' ? 'Tambah Data Baru' : 'Edit Data'}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mt-3">
              <div class="col-lg-12 mb-3">
                <div class="form-group">
                  <label :class="$v.single.code.$error ? 'text-danger' : ''">Kode barang</label>
                  <input v-model="single.code" type="text" class="form-control" placeholder="Masukkan kode barang"
                    :class="$v.single.code.$error ? 'error' : ''">
                  <div v-if="$v.single.code.$error" class="text-danger pt-1 text-xs">
                    Format kode barang adalah 3 digit awal berupa huruf, digit ke 4 adalah "-" dan 3 digit terakhir
                    berupa angka. Contoh penulisan : BRG-001
                  </div>
                </div>
              </div>
              <div class="col-lg-12 mb-3">
                <div class="form-group">
                  <label :class="$v.single.name.$error ? 'text-danger' : ''">Nama barang</label>
                  <input v-model="single.name" type="text" class="form-control" placeholder="Masukkan nama barang"
                    :class="$v.single.name.$error ? 'error' : ''">
                  <div v-if="$v.single.name.$error" class="text-danger pt-1 text-xs">
                    Nama tidak boleh kosong
                  </div>
                </div>
              </div>
              <div class="mb-3" :class="flag == 'insert' ? 'col-lg-6' : 'col-lg-12'">
                <div class="form-group">
                  <label :class="$v.single.minimum_stock.$error ? 'text-danger' : ''">Stok Minimal</label>
                  <app-money v-model="single.minimum_stock" class="form-control text-right" v-bind="mask"
                    :class="$v.single.minimum_stock.$error ? 'error' : ''"></app-money>
                  <div v-if="$v.single.minimum_stock.$error" class="text-danger pt-1 text-xs">
                    Stok minimal tidak boleh kurang dari 10
                  </div>
                </div>
              </div>
              <div v-if="flag == 'insert'" class="col-lg-6 mb-3">
                <div class="form-group">
                  <label :class="$v.single.opening_stock.$error ? 'text-danger' : ''">Stok Awal</label>
                  <app-money v-model="single.opening_stock" class="form-control text-right" v-bind="mask"
                    :class="$v.single.opening_stock.$error ? 'error' : ''"></app-money>
                  <div v-if="$v.single.opening_stock.$error" class="text-danger pt-1 text-xs">
                    Stok awal tidak boleh lebih dari 50
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
            <button v-if="flag == 'insert'" type="button" class="btn btn-primary" @click="store">Simpan</button>
            <button v-if="flag == 'update'" type="button" class="btn btn-primary" @click="update">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    required
  } from 'vuelidate/lib/validators'
  import {
    Money
  } from 'v-money';
  const Minimum10 = (value) => parseFloat(value.toString().replace(/\\,/g, '')) >= 10
  const maksimum50 = (value) => parseFloat(value.toString().replace(/\\,/g, '')) <= 50
  export default {
    components: {
      'app-money': Money
    },
    middleware: 'auth',
    data() {
      return {
        username: '',
        flag: 'insert',
        item: [{
            code: 'BRG-001',
            name: 'Komputer',
            minimum_stock: 1,
            stock: 10,
          },
          {
            code: 'BRG-002',
            name: 'Laptop',
            minimum_stock: 10,
            stock: 5,
          }
        ],
        mask: {
          decimal: ',',
          thousands: '.',
          precision: 0,
          masked: false
        },
        single: {
          index: '',
          code: '',
          name: '',
          minimum_stock: '',
          opening_stock: '',
        }
      }
    },
    validations: {
      single: {
        code: {
          required,
          checkedRule(value) {

            if (value && value.length === 7) {
              if (value.charAt(0).match(/[a-z]/i) && value.charAt(1).match(/[a-z]/i) && value.charAt(2).match(
                  /[a-z]/i) && value.charAt(3) === '-' && !isNaN(parseInt(value.charAt(4))) && !isNaN(parseInt(value
                  .charAt(5))) && !isNaN(parseInt(value.charAt(6)))) {
                return true
              } else {
                return false
              }
            } else {
              return false;
            }
          }
        },
        name: {
          required
        },
        minimum_stock: {
          Minimum10
        },
        opening_stock: {
          maksimum50
        }
      }
    },
    mounted() {
       this.username = localStorage.getItem('user');
      window.$('#example').DataTable({
        "language": {
          "paginate": {
            "previous": "<",
            "next": ">"
          }
        },
      });
    },
    methods: {
      add() {
        this.flag = 'insert';
        this.reset();
        window.$("#modal-item").modal('show');
      },
      store() {
        this.$v.$touch();
        if (this.$v.$error) {
          return false;
        }
        this.item.push({
          code: this.single.code,
          name: this.single.name,
          minimum_stock: this.single.minimum_stock ? this.single.minimum_stock : 0,
          stock: this.single.opening_stock ? this.single.opening_stock : 0,
        });

        window.$("#modal-item").modal('hide');

        this.refreshDataTable();


        setTimeout(() => {
          this.$swal.fire(
            'Berhasil!',
            'Data baru berhasil dibuat.',
            'success'
          )
        }, 500);

      },
      edit(index) {

        this.flag = 'update';
        this.reset();
        this.single.index = index;
        this.single.name = this.item[index].name;
        this.single.code = this.item[index].code;
        this.single.minimum_stock = this.item[index].minimum_stock;
        this.single.opening_stock = 0;

        window.$("#modal-item").modal('show');
      },
      update() {
        this.$v.$touch();
        if (this.$v.$error) {
          return false;
        }
        this.item[this.single.index].code = this.single.code;
        this.item[this.single.index].name = this.single.name;
        this.item[this.single.index].minimum_stock = this.single.minimum_stock ? this.single.minimum_stock : 0;

        window.$("#modal-item").modal('hide');

        this.refreshDataTable();


        setTimeout(() => {
          this.$swal.fire(
            'Berhasil!',
            'Data berhasil diperbarui.',
            'success'
          )
        }, 500);
      },
      confirmHapus(index) {
        this.$swal.fire({
          title: 'Apakah anda yakin ingin hapus  data ini?',
          text: "",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#EB5757',
          cancelButtonColor: '#B4B4B4',
          cancelButtonText: 'Tidak',
          confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
          if (result.value) {
            this.hapus(index);
          }
        });
      },
      hapus(index) {
        this.item.splice(index, 1);
        this.refreshDataTable();


        setTimeout(() => {
          this.$swal.fire(
            'Berhasil!',
            'Data berhasil dihapus.',
            'success'
          )
        }, 500);
      },
      history(index) {
        this.$router.push({
          path: '/history'
        })
      },
      reset() {
        this.$v.$reset();
        this.single.index = '';
        this.single.code = '';
        this.single.name = '';
        this.single.minimum_stock = 0;
        this.single.opening_stock = 0;
      },
      refreshDataTable() {
        window.$('#example').DataTable().destroy();
        setTimeout(() => {
          window.$('#example').DataTable({
            "language": {
              "paginate": {
                "previous": "<",
                "next": ">"
              }
            },
          });
        }, 300);
      }
    }
  }

</script>
