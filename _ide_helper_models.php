<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $nit
 * @property string $nrc
 * @property string $nombre
 * @property string $codActividad
 * @property string $descActividad
 * @property string|null $nombreComercial
 * @property string $tipoEstablecimiento
 * @property string $departamento
 * @property string $municipio
 * @property string $complemento
 * @property string $telefono
 * @property string $correo
 * @property string|null $codEstableMH
 * @property string|null $codEstable
 * @property string|null $codPuntoVentaMH
 * @property string|null $codPuntoVenta
 * @property bool $activo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereActivo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereCodActividad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereCodEstable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereCodEstableMH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereCodPuntoVenta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereCodPuntoVentaMH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereComplemento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereCorreo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereDepartamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereDescActividad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereMunicipio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereNit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereNombreComercial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereNrc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereTelefono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereTipoEstablecimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Emitter whereUpdatedAt($value)
 */
	class Emitter extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $product_name
 * @property string $product_code
 * @property string $category
 * @property \App\Enums\TipoItem $tipo_item
 * @property string $description
 * @property int $stock
 * @property string $ivaItem
 * @property numeric $price
 * @property string $img_product
 * @property int $min_stock
 * @property int $max_stock
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereImgProduct($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereIvaItem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereMaxStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereMinStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereProductCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereProductName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereTipoItem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inventory whereUpdatedAt($value)
 */
	class Inventory extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $nit
 * @property string $nrc
 * @property string $nombre
 * @property string $codActividad
 * @property string $descActividad
 * @property string|null $nombreComercial
 * @property string $departamento
 * @property string $municipio
 * @property string $complemento
 * @property string|null $telefono
 * @property string $correo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesHistory> $salesHistory
 * @property-read int|null $sales_history_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereCodActividad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereComplemento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereCorreo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereDepartamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereDescActividad($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereMunicipio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereNit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereNombreComercial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereNrc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereTelefono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receiver whereUpdatedAt($value)
 */
	class Receiver extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\RoleUser|null $pivot
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereUpdatedAt($value)
 */
	class Role extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property string $user_id
 * @property string $role_slug
 * @property-read \App\Models\Role $role
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RoleUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RoleUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RoleUser query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RoleUser whereRoleSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RoleUser whereUserId($value)
 */
	class RoleUser extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $tipoDTE
 * @property string $numeroControl
 * @property string $codigoGeneracion
 * @property string|null $tipoContingencia
 * @property string|null $motivoContingencia
 * @property string $tipoModelo
 * @property string $horaEmi
 * @property string $fechaEmi
 * @property string $tipoMoneda
 * @property string $nitReceiver
 * @property string $estado
 * @property array<array-key, mixed>|null $json_enviado
 * @property array<array-key, mixed>|null $json_recibido
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Receiver $receiver
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereCodigoGeneracion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereFechaEmi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereHoraEmi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereJsonEnviado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereJsonRecibido($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereMotivoContingencia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereNitReceiver($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereNumeroControl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereTipoContingencia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereTipoDTE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereTipoModelo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereTipoMoneda($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SalesHistory withoutTrashed()
 */
	class SalesHistory extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $user_id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $department
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $status
 * @property string|null $start_at
 * @property string|null $deleted_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\RoleUser|null $pivot
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Role> $roles
 * @property-read int|null $roles_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDepartment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUserId($value)
 */
	class User extends \Eloquent {}
}

