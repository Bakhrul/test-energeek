<template>
  <div>
    <Navbar></Navbar>
    <section class="page-wrapper">
      <div class="container">
        <div class="history-box mb-5">
          <div class="row">
            <div class="col-lg-3 col-md-6 my-2 text-center">
              <div class="title">Kode Barang</div>
              <div class="desc">BRG-001</div>
            </div>
            <div class="col-lg-3 col-md-6 my-2 text-center">
              <div class="title">Nama Barang</div>
              <div class="desc">Komputer</div>
            </div>
            <div class="col-lg-3 col-md-6 my-2 text-center">
              <div class="title">Total Stok</div>
              <div class="desc">{{total}}</div>
            </div>
            <div class="col-lg-3 col-md-6 my-2 text-center">
              <div class="title">Stok Minimal</div>
              <div class="desc">1</div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between flex-wrap  align-items-center mb-3">
          <div class="d-flex flex-wrap">
            <div class="page-title me-3">History Transaksi</div>
            <button class="btn btn-primary" type="button" @click="add"><i class="fa fa-plus"></i>&ensp;Tambah
              Data</button>
          </div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <nuxt-link to="/" style="text-decoration:none !important;color:black">Inventory</nuxt-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">History</li>
            </ol>
          </nav>
        </div>
        <div class="card mb-5">
          <div class="card-body">
            <div class="table-responsive">
              <table id="example" class="table table-bordered table-custom" style="width:100%;min-width:800px;">
                <thead>
                  <tr>
                    <th class="text-center">No</th>
                    <th>Tanggal Transaksi</th>
                    <th>Jenis Transaksi</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(context, index) in mutation" :key="index">
                    <td style="vertical-align:middle;" class="text-center">{{index + 1}}</td>
                    <td style="vertical-align:middle;">{{context.date}}</td>
                    <td style="vertical-align:middle;">
                      <span v-if="context.type == 'in'" class="text-info fw-bold">Menambah</span>
                      <span v-if="context.type == 'out'" class="text-danger fw-bold">Mengurangi</span>
                    </td>
                    <td style="vertical-align:middle;">{{context.qty}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div id="modal-mutation" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="exampleModalLabel" class="modal-title">Tambah Data</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mt-3">
              <div class="col-lg-12 mb-3">
                <div class="form-group">
                  <label :class="$v.single.type.$error ? 'text-danger' : ''">Jenis Transaksi</label>
                  <div class="d-flex flex-wrap mt-3">

                    <div class="form-check me-3">
                      <input id="type1" v-model="single.type" class="form-check-input" type="radio" name="type"
                        value="in">
                      <label class="form-check-label" for="type1">
                        Menambah
                      </label>
                    </div>

                    <div class="form-check me-3">
                      <input id="type2" v-model="single.type" class="form-check-input" type="radio" name="type"
                        value="out">
                      <label class="form-check-label" for="type2">
                        Mengurangi
                      </label>
                    </div>
                  </div>
                  <div v-if="$v.single.type.$error" class="text-danger pt-1 text-xs">
                    Pilih jenis transaksi dahulu!
                  </div>
                </div>
              </div>
              <div class="col-lg-12 mb-3">
                <div class="form-group">
                  <label :class="$v.single.qty.$error ? 'text-danger' : ''">Jumlah</label>
                  <app-money v-model="single.qty" class="form-control text-right" v-bind="mask"
                    :class="$v.single.qty.$error ? 'error' : ''"></app-money>
                  <div v-if="$v.single.qty.$error" class="text-danger pt-1 text-xs">
                    Jumlah tidak boleh nol!
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary" @click="store">Simpan</button>
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
  const munstIntegerNotNull = (value) => parseFloat(value.toString().replace(/\\,/g, '')) > 0
  export default {
    components: {
      'app-money': Money,
    },
    middleware: 'auth',
    data() {
      return {
        mutation: [{
            date: '10-05-2022',
            type: 'in',
            qty: 10,
          },
          {
            date: '11-05-2022',
            type: 'in',
            qty: 2,
          },
          {
            date: '12-05-2022',
            type: 'out',
            qty: 5,
          }
        ],
        mask: {
          decimal: ',',
          thousands: '.',
          precision: 0,
          masked: false
        },
        single: {
          type: 'in',
          qty: 0,
        }
      }
    },
    validations: {
      single: {
        type: {
          required,
        },
        qty: {
          munstIntegerNotNull
        }
      }
    },
    computed: {
      total() {
        let response = 0;
        for (let i = 0; i < this.mutation.length; i++) {
          if (this.mutation[i].type === 'in') {
            response += this.mutation[i].qty;
          } else {
            response -= this.mutation[i].qty;
          }
        }

        return response;

      }
    },
    mounted() {
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
        this.reset();
        window.$("#modal-mutation").modal('show');
      },
      store() {
        this.$v.$touch();
        if (this.$v.$error) {
          return false;
        }
        this.mutation.push({
          date: this.convertDate(new Date()),
          type: this.single.type,
          qty: this.single.qty ? this.single.qty : 0,
        });

        window.$("#modal-mutation").modal('hide');

        this.refreshDataTable();


        setTimeout(() => {
          this.$swal.fire(
            'Berhasil!',
            'Data baru berhasil dibuat.',
            'success'
          )
        }, 500);

      },
      convertDate(date) {
        const yyyy = date.getFullYear().toString();
        const mm = (date.getMonth() + 1).toString();
        const dd = date.getDate().toString();

        const mmChars = mm.split('');
        const ddChars = dd.split('');

        return (ddChars[1] ? dd : "0" + ddChars[0]) + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + yyyy;
      },
      reset() {
        this.$v.$reset();
        this.single.type = 'in';
        this.single.qty = 0;
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
